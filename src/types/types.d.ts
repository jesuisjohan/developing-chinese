type Lessons = Record<string, Lesson>

type Lesson = {
    title: string
    newWords: NewWord[]
}

type NewWord = [Word, Pinyin, Meaning]
type Word = string
type Pinyin = string
type Meaning = string

type AskUntilCorrectProps = {
    question: string
    correctAnswer: string
    type: 'word' | 'pinyin' | 'meaning'
}
