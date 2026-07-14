"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { getUsers, deleteUser, updateUserRole } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagementPage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isPending && (!session || session.user.role !== 'admin')) {
            // Only admin can access this page
            router.push("/dashboard")
        }
    }, [session, isPending, router])

    useEffect(() => {
        if (session && session.user.role === 'admin') {
            fetchUsers()
        }
    }, [session])

    async function fetchUsers() {
        setLoading(true)
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error("Failed to load users:", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            await deleteUser(id)
            setUsers(users.filter(user => user.id !== id && user._id !== id))
        } catch (error) {
            console.error("Failed to delete user:", error)
        }
    }

    async function handleRoleChange(id: string, newRole: string) {
        try {
            await updateUserRole(id, newRole)
            setUsers(users.map(u => u.id === id || u._id === id ? { ...u, role: newRole } : u))
        } catch (error) {
            console.error("Failed to update role:", error)
        }
    }

    if (isPending || loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-10 w-48 mb-6" />
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-12 w-full mb-2" />
                        <Skeleton className="h-12 w-full mb-2" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!session || session.user.role !== 'admin') return null

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id || user._id}>
                                        <TableCell className="font-medium">{user.name || "Unknown"}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={user.role || 'user'}
                                                onValueChange={(val) => handleRoleChange(user.id || user._id, val)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                onClick={() => handleDelete(user.id || user._id)}
                                                disabled={session.user.id === (user.id || user._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
