import type { ClientTask } from './interface'

// API endpoints


//API error handling
async function handleApiError(response: Response): Promise<void> {
  if (!response.ok) {
    let errorDetails = `HTTP Error ${response.status}: ${response.statusText}.`
    try {
      const errorBody = await response.json()
      errorDetails += ` Server Message: ${JSON.stringify(errorBody)}`
    } catch (parseError) {
      console.error(`Query failed : ${parseError}`)
    }
    throw new Error(errorDetails)
  }
}

//Get API data
export async function getData<T>(apiURL: string): Promise<T[]> {
  try {
    const response = await fetch(apiURL, {
      method: 'GET',
    })

    await handleApiError(response)

    if (response.status === 204) {
      return []
    }

    const fetchedData = await response.json()
    if (Array.isArray(fetchedData)) {
      return fetchedData as T[]
    }
    console.warn(`API at ${apiURL} returned data, but it was not an array`)
    return [] as T[]
  } catch (error) {
    console.error('Failed to fetch data', error)
    throw error
  }
}

//Post request
export async function postData<T>(
  apiURL: string,
  newData: ClientTask,
): Promise<T> {
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(newData),
    })

    await handleApiError(response)
    if (response.status === 204) {
      throw new Error(
        'POST-ERROR: Data successfully posted but nothing returned',
      )
    }

    const responseArr = await response.json()
    if (!Array.isArray(responseArr)) {
      throw new Error('POST-ERROR: Returned data is not an Array')
    }
    if (responseArr.length === 0) {
      throw new Error('POST-ERROR: Expected one object but got none.')
    }
    if (responseArr.length > 1) {
      console.warn(
        'POST-WARN: Expected one object but got more. Using the first one.',
        responseArr,
      )
    }
    return responseArr[0] as T
  } catch (error) {
    console.error(`Data failed to post to ${apiURL}: `, error)
    throw error
  }
}

//Patch request
export async function patchData<C, R>(
  apiURL: string,
  id: number,
  updatedDatas: C,
): Promise<R | null> {
  const completeURL = `${apiURL}?id=eq.${id}`
  try {
    const response = await fetch(completeURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDatas),
    })
    await handleApiError(response)
    if (response.status === 204) {
      return null
    }
    const updatedResource: unknown = await response.json()
    return updatedResource as R
  } catch (error) {
    console.error(`Patch failed for task ${id} at ${completeURL}:`, error)
    throw error
  }
}

//Delete query
export async function deleteData(apiURL: string, id: number): Promise<void> {
  const completeURL = `${apiURL}?id=eq.${id}`
  try {
    const response = await fetch(completeURL, {
      method: 'DELETE',
    })
    await handleApiError(response)
  } catch (error) {
    console.error(`Delete failed for task ${id} at ${completeURL}:`, error)
    throw error
  }
}

// Delete all tasks
export async function deleteAllData(apiURL: string): Promise<void> {
  try {
    const response = await fetch(apiURL, {
      method: 'DELETE',
    })
    await handleApiError(response)
  } catch (error) {
    console.error(`Delete failed at ${apiURL}:`, error)
    throw error
  }
}
