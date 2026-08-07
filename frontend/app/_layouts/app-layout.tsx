import AppLayoutTemplate from "@/app/_layouts/app/app-sidebar-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { type ReactNode } from "react"

interface AppLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
)
