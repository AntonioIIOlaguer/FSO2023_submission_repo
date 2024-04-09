import blogsService from '../services/blogs'

const handleLike = async ({ object, service, notify, render }) => {
  try {
    const updatedObject = {
      ...object,
      likes: object.likes + 1,
      user: object.user.id,
    }
    const returnedObject = await service.update(updatedObject)
    render(returnedObject, 'update')
  } catch (error) {
    notify({ type: 'error', text: 'Oops something went wrong.' })
  }
}


export { handleLike }