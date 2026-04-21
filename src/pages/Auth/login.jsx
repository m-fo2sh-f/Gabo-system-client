import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/common/Input';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/api/useAuth';

const Login = () => {

    const { mutate, isPending, isError, error } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (formData) => {
        mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-variant/20 p-4">
            <div className="bg-surface p-8 rounded-2xl shadow-sm w-full max-w-md border border-outline-variant/30">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h1>
                    <p className="text-on-surface-variant text-sm">Please login to your account</p>
                </div>

                {isError && (
                    <div className="mb-6 p-3 bg-error/10 text-error text-sm rounded-lg border border-error/20 text-center">
                        {error.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        error={errors.password?.message}
                    />

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="primary-btn w-full flex justify-center items-center py-3"
                            disabled={isPending}
                        >
                            <span className="material-symbols-outlined text-[20px] mr-2">
                                login
                            </span>
                            {isPending ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
