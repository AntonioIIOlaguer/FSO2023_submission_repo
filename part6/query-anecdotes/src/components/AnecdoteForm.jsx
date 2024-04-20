import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../services/anecdotesService"
import { useNotificationDispatch } from "./notificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notify = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: (newAnecdote) =>{
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
  },
    onError: (error) =>{
      const text = error.response.data.error
      notify({type: 'notify', text}) 
      setTimeout(()=> notify({type: 'clearNotification'}), 5000)
    }    
})

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
