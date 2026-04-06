const share = (activityId: string) => {
  const url = `http://localhost:5173/solve/${activityId}`;
  window.open(`https://wa.me/?text=Responda a atividade: ${url}`);
};