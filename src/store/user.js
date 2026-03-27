import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore('user',{
    state: () =>({
        token: localStorage.getItem('token') || '',
        role: localStorage.getItem('role') || '',
    }),

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)

            const decoded = jwtDecode(token)
            this.role = decoded.role || ''
            localStorage.setItem('role', this.role)
        },

        logout() {
            this.token = ''
            this.role = ''
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        }
    }
})