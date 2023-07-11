'use client';

import { useEffect } from "react";
import EmptyState from "./components/EmplyState";

interface ErrorStateProps {
    error: Error
}
const ErrorState: React.FC<ErrorStateProps> = ({
    error
}) => {
    useEffect(() => {
        console.log(error);
    },[error]);
    return (
        <EmptyState
            title="Error"
            subtitle="Something went wrong!!" 
        />
    )
};

export default ErrorState;