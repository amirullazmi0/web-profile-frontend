import { Suspense } from 'react';
import AdminUsersView from './admin.users.view';

export default function page() {
    return (
        <Suspense fallback={null}>
            <AdminUsersView />
        </Suspense>
    );
}
