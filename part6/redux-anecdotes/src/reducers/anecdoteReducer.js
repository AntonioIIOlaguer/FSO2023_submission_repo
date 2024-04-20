import anecdoteService from "../services/anecdoteService"
import { createSelector, createSlice } from "@reduxjs/toolkit"


const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    updateAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id !== action.payload.id ?
          anecdote :
          action.payload
      )
    },

    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const initilizeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await anecdoteService.voteAnecdote(updatedAnecdote)
    dispatch(updateAnecdote(response))
  }
}

export const filteredAnecdoteSelector = createSelector(
  state => state.anecdotes,
  state => state.filter,
  (anecdotes, filter) => {

    const sortedAnecdotes = [...anecdotes]
      .sort((a, b) => {
        return b.votes - a.votes
      })

    return filter
      ? sortedAnecdotes.filter((anecdote) => {
        return anecdote.content.toLowerCase().includes(filter.toLowerCase())
      })
      : sortedAnecdotes

  }
)

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdotesSlice.actions
export default anecdotesSlice.reducer