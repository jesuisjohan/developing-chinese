type Lessons = Record<number, Lesson>

type Lesson = {
    title: string
    newWords: NewWord[]
}

type NewWord = [Word, Pinyin, Meaning]
type Word = string
type Pinyin = string
type Meaning = string | string[]

type AskUntilCorrectProps = {
    question: string
    correctAnswers: string | string[]
    type: 'word' | 'pinyin' | 'meaning'
}
