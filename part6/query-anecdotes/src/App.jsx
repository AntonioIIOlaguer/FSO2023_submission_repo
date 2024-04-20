import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, voteAnecdote } from './services/anecdotesService.js'
import { useNotificationDispatch } from './components/notificationContext.jsx'

const App = () => {
  const queryClient = useQueryClient()
  const notify = useNotificationDispatch()
  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map((anecdote) => {
        return anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      })
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
    }
  })
  const handleVote = (anecdote) => {
    voteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    const text = `anecdote '${anecdote.content}' voted`
    notify({type: 'notify', text})
    setTimeout(()=>
    notify({type:'clearNotification'}), 5000
    )
  }

const result = useQuery({
  queryKey: ['anecdotes'],
  queryFn: getAnecdotes
})


if (result.isLoading){
  return <div>loading data...</div>
}

if (result.isError) {
  return <div>anecdote service not available due to problems in server</div>
}

const anecdotes = result.data
  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
