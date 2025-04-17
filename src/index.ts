import * as readline from 'readline'

import { LESSONS } from './data/constants-4.1'

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

    let perfectAnswer = true

    while (answer !== finalCorrectAnswer) {
        answer = await askQuestion(question)
        if (answer === finalCorrectAnswer) {
            console.log('Correct!')
        } else {
            console.log(`Incorrect. The correct answer is: ${correctAnswer}`)
            perfectAnswer = false
        }
    }

    return perfectAnswer
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

    let shuffledLessons: [string, Lesson][] = []

    const shouldSpecifyLessons = await askQuestion(
        'Do you want to specify the lessons? (y/n) '
    )

    if (shouldSpecifyLessons.toLowerCase() === 'y') {
        const lessonKeys = Object.keys(LESSONS)

        console.log('Available lessons:')
        lessonKeys.forEach((key, index) => {
            console.log(`${index + 1}: ${key}`)
        })

        const selectedLessons = await askQuestion(
            'Enter the lesson numbers you want to practice (comma-separated): '
        )

        const selectedLessonKeys = selectedLessons
            .split(',')
            .map((key) => key.trim())

        shuffledLessons = Object.entries(LESSONS).filter(([key]) =>
            selectedLessonKeys.includes(key)
        )
    } else {
        const shouldShuffleLessons = await askQuestion(
            'Do you want to shuffle the lessons? (y/n) '
        )

        shuffledLessons =
            shouldShuffleLessons.toLowerCase() === 'y'
                ? shuffleArray(Object.entries(LESSONS))
                : Object.entries(LESSONS)
    }

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

        let imperfectNewWords: NewWord[] = []

        for (const [word, pinyin, meaning] of shuffledNewWords) {
            const p0 = await askUntilCorrect({
                question: `What is the meaning of "${word}"? `,
                correctAnswer: meaning,
                type: 'meaning',
            })

            console.log('All pinyin options:')

            const pinyinOptions = [...allPinyin].sort((a, b) => {
                return a.localeCompare(b)
            })

            printWordsTable(pinyinOptions, 2, 25)

            const pinyinIndex = pinyinOptions.indexOf(pinyin) + 1

            const p1 = await askUntilCorrect({
                question: `What is the pinyin for "${word}"? `,
                correctAnswer: `${pinyinIndex}`,
                type: 'pinyin',
            })

            const p2 = await askUntilCorrect({
                question: `Type this word again: "${word}" `,
                correctAnswer: word,
                type: 'word',
            })

            if (p0 && p1 && p2) {
                console.log('Perfect!')
            } else {
                imperfectNewWords.push([word, pinyin, meaning])
            }
        }

        while (imperfectNewWords.length > 0) {
            console.log('You have some words to practice again.')

            for (const [word, pinyin, meaning] of imperfectNewWords) {
                const p0 = await askUntilCorrect({
                    question: `What is the meaning of "${word}"? `,
                    correctAnswer: meaning,
                    type: 'meaning',
                })

                console.log('All pinyin options:')

                const pinyinOptions = [...allPinyin].sort((a, b) => {
                    return a.localeCompare(b)
                })

                printWordsTable(pinyinOptions, 2, 25)

                const pinyinIndex = pinyinOptions.indexOf(pinyin) + 1

                const p1 = await askUntilCorrect({
                    question: `What is the pinyin for "${word}"? `,
                    correctAnswer: `${pinyinIndex}`,
                    type: 'pinyin',
                })

                const p2 = await askUntilCorrect({
                    question: `Type this word again: "${word}" `,
                    correctAnswer: word,
                    type: 'word',
                })

                if (p0 && p1 && p2) {
                    console.log('Perfect!')

                    imperfectNewWords = imperfectNewWords.filter(
                        ([w]) => w !== word
                    )
                }
            }
        }
    }

    rl.close()
}

main()
