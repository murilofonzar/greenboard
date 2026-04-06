export const saveAuth = (data: any) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};