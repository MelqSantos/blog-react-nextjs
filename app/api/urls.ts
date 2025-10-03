export const userEndpoints = {
    create: 'http://localhost:8080/user',
    login: 'http://localhost:8080/user/signin',
}

export const postEndpoints = {
    create: 'http://localhost:8080/post',
    list: 'http://localhost:8080/post',
    getById: (id: string) => `http://localhost:8080/post/${id}`,
    update: (id: string) => `http://localhost:8080/post/${id}`,
    delete: (id: string) => `http://localhost:8080/post/${id}`,
    search: (text: string) => `http://localhost:8080/search/${text}`,
}