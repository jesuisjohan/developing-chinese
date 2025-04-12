import * as readline from 'readline'

import { LESSONS } from './data/constants'

Object.entries(LESSONS).forEach(([key, { title, newWords }]) => {
    console.log(`Lesson ${key}: ${title}`)
    console.log('New words:')

    newWords.forEach(([word, pinyin, meaning], index) => {
        console.log(`- ${index + 1}: ${word} (${pinyin}): ${meaning}`)
    })
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const askQuestion = (question: string) => {
    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer)
        })
    })
}

const askUntilCorrect = async (props: AskUntilCorrectProps) => {
    const { question, correctAnswer, type } = props

    const finalCorrectAnswer =
        type === 'meaning' ? correctAnswer.toLowerCase() : correctAnswer

    let answer = ''

    while (answer !== finalCorrectAnswer) {
        answer = await askQuestion(question)
        if (answer === finalCorrectAnswer) {
            console.log('Correct!')
        } else {
            console.log(`Incorrect. The correct answer is: ${correctAnswer}`)
        }
    }
}

const shuffleArray = <T>(target: T[]) => {
    const array = [...target]

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }

    return array
}

const printWordsTable = (
    words: string[],
    columnCount: number,
    padEndMaxLength: number
) => {
    for (let i = 0; i < words.length; i += columnCount) {
        const row = words
            .slice(i, i + columnCount)
            .map(
                (word, idx) => i + idx + 1 + ': ' + word.padEnd(padEndMaxLength)
            )
            .join('|')

        console.log(row)
    }
}

const main = async () => {
    console.log('Welcome to the Chinese learning program!')

    const shouldShuffleLessons = await askQuestion(
        'Do you want to shuffle the lessons? (y/n) '
    )

    const shuffledLessons =
        shouldShuffleLessons.toLowerCase() === 'y'
            ? shuffleArray(Object.entries(LESSONS))
            : Object.entries(LESSONS)

    for (const [key, { title, newWords }] of shuffledLessons) {
        console.log(`Lesson ${key}: ${title}`)

        console.log('New words:')

        newWords.forEach(([word, pinyin, meaning], index) => {
            console.log(`- ${index + 1}: ${word} (${pinyin}): ${meaning}`)
        })

        const shouldShuffleNewWords = await askQuestion(
            'Do you want to shuffle the words? (y/n) '
        )

        const shuffledNewWords =
            shouldShuffleNewWords.toLowerCase() === 'y'
                ? shuffleArray(newWords)
                : newWords

        const allPinyin = newWords.map(([, pinyin]) => pinyin)

        for (const [word, pinyin, meaning] of shuffledNewWords) {
            await askUntilCorrect({
                question: `What is the meaning of "${word}"? `,
                correctAnswer: meaning,
                type: 'meaning',
            })

            console.log('All pinyin options:')

            const shuffledPinyin = shuffleArray(allPinyin)

            printWordsTable(shuffledPinyin, 2, 25)

            const pinyinIndex = shuffledPinyin.indexOf(pinyin) + 1

            await askUntilCorrect({
                question: `What is the pinyin for "${word}"? `,
                correctAnswer: `${pinyinIndex}`,
                type: 'pinyin',
            })

            await askUntilCorrect({
                question: `Type this word again: "${word}" `,
                correctAnswer: word,
                type: 'word',
            })
        }
    }

    rl.close()
}

main()
