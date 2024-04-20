import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'
import { getId } from './helperReducer'

describe('anecdoteReducer', () => {
    test('returns new state with action NEW_NOTE', () => {
        const state = []
        const newAnecdote = {
            content: "If it hurts, do it more often",
            id: getId(),
            views: 0
        }

        const action = {
            type: 'NEW_ANECDOTE',
            payload: newAnecdote
        }

        deepFreeze(state)
        const newState = anecdoteReducer(state, action)

        expect(newState).toHaveLength(1)
        expect(newState).toContainEqual(newAnecdote)
    })

    test('adds vote with action ADD_VOTE', () => {
        const objectId = getId()
        const state = [
            {
                content: "If it hurst, do it more often",
                id: objectId,
                votes: 1
            }
        ]

        const action = {
            type: 'ADD_VOTE',
            payload: { id: objectId }
        }

        deepFreeze(state)
        const newState = anecdoteReducer(state, action)

        expect(newState).toHaveLength(1)
        expect(newState[0].votes).toEqual(2)
    })

})