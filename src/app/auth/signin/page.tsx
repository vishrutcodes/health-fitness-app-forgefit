import { SignInForm } from "@/components/auth/signin-form";

export const dynamic = "force-dynamic";

export default async function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string }>;
}) {
    const params = await searchParams;
    const redirect = params.redirect || "/dashboard";

    return <SignInForm redirect={redirect} />;
}
