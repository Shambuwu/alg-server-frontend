export default interface ApiPropsInterface {
    user: string
    setUser: (string) => void
    label?: string
    setLabel?: (string) => void
    action: (e: any) => Promise<void>
    type?: string
    message: string
    status: number
    hideTextField: boolean
}