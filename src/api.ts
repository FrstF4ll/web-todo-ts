import type { ClientTask } from './interface'

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
    const responseArr = (await response.json()) as T[]
    if (responseArr.length > 1) {
      console.warn(
        'POST-ERROR: Expected one object but got two. Check for duplication.',
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

    const updatedResource: unknown = await response.json()
    return updatedResource as R
  } catch (error) {
    console.error(`Patch failed for task ${id} at ${completeURL}:`, error)
    throw error
  }
}

//Delete request
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

// Delete request
export async function deleteAllData(apiURL: string): Promise<void> {
  const completeURL = `${apiURL}`
  try {
    const response = await fetch(completeURL, {
      method: 'DELETE',
    })
    await handleApiError(response)
  } catch (error) {
    console.error(`Delete failed at ${completeURL}:`, error)
    throw error
  }
}
