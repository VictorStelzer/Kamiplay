export async function fetchUserData(username: string) {
    const response = await fetch(`http://localhost:3001/user/${username}`);
    const data = await response.json();
    return data;
  }
  