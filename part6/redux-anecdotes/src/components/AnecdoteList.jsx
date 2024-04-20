import { useDispatch, useSelector  } from "react-redux"
import { filteredAnecdoteSelector, voteAnecdote } from "../reducers/anecdoteReducer"
import { notify } from "../reducers/notificationReducer"

const Anecdotes = ({content, votes, handleVote}) => {
    return (
        <div>
            <div>
                {content}
            </div>
            <div>
                has {votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>
    )
}

const AnecdotesList = () => {
  const anecdotes = useSelector(filteredAnecdoteSelector)
  const dispatch = useDispatch()

  const vote = async (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(notify(`you voted ${anecdote.content}`, 3000))
  }


    return(
    <div>
      {anecdotes.map(anecdote =>
        <Anecdotes 
            key={anecdote.id} 
            votes={anecdote.votes} 
            content={anecdote.content}
            handleVote={() => vote(anecdote)}
        />
      )}

    </div>
    )
}

export default AnecdotesList