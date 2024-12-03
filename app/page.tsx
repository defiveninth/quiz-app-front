'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header/student'
import useMyAttempts from '@/actions/attempt/get-my-attempts'
import useGetAllQuizzes from '@/actions/quiz/get-all'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function Index() {
  const { isLoading: isLoadingAttempts, error: attemptsError, attempts, fetchAttemts } = useMyAttempts()
  const { isLoading: isLoadingQuizzes, error: quizzesError, quizzes, fetchQuizzes } = useGetAllQuizzes()

  useEffect(() => {
    fetchAttemts()
    fetchQuizzes()
  }, [])

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-5 pt-5 pb-10">
        <Header />

        <Tabs defaultValue="all-quizzes" className="max-w-lg w-full mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-quizzes">Барлық сабактар</TabsTrigger>
            <TabsTrigger value="history">Тарих</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <h2 className='font-medium text-xl mb-5'>Тарих:</h2>
            {isLoadingAttempts ? (
              <p>Жүктелуде...</p>
            ) : attemptsError ? (
              <p className="text-red-500">Қате: {attemptsError}</p>
            ) : (
              <div className="space-y-4">
                {attempts.length > 0 ? (
                  attempts.map((attempt, index) => {
                    const { quiz, score, createdAt } = attempt
                    const totalQuestions = quiz?.questions?.length || 0
                    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

                    return (
                      <div key={index} className="border-pink-500 border shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-semibold">{quiz?.title}</h3>
                        <p className="text-sm text-gray-500">{quiz?.description}</p>
                        <p className="mt-2">
                          <strong>Ұпай:</strong> {score}/{totalQuestions} ({percentage.toFixed(2)}%)
                        </p>
                        <p className="text-sm text-gray-400">
                          Өткізілген күні: {new Date(createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <p>Сіз әлі ешқандай тесттен өтпегенсіз.</p>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="all-quizzes">
            <h2 className='font-medium text-xl mb-5'>Барлық сабактар:</h2>
            {isLoadingQuizzes ? (
              <p>Жүктелуде...</p>
            ) : quizzesError ? (
              <p className="text-red-500">Қате: {quizzesError}</p>
            ) : (
              <div className="space-y-4">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div key={quiz.id} className="border-pink-500 border shadow-md rounded-lg p-4">
                      <h3 className="text-xl font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">{quiz.description}</p>
                      <div className="mt-4">
                        <Link href={`/quiz/${quiz.id}`} passHref>
                          <Button>Сабакты бастау</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Қолжетімді тесттер жоқ.</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

