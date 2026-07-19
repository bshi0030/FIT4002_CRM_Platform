import api from "./client";

export const getUsers = () =>
    api.get("/users")
       .then(res => res.data);