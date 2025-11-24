import AppLayout from "@/components/layout/appLayout";

export default function UserLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return <AppLayout>{ children }</AppLayout>;
}