export async function updatePlayerWPMRequest(gameID: string, playerNumber: number, score: number) {
    try {
      const url = new URL(`/api/game/setScore`, window.location.origin);
      url.searchParams.append('gameID', gameID);
      url.searchParams.append('playerNumber', playerNumber.toString());
      url.searchParams.append('score', score.toString());
  
      const response = await fetch(url.toString(), {
        method: 'PATCH',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update WPM');
      }
  
      return data;
    } catch (error) {
      console.error('Error in updatePlayerWPMRequest:', error);
      throw error;
    }
  }
  