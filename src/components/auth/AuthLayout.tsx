import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/godex-logo.png";

const AuthLayout = ({ title, subtitle, children }: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}) => (
	<div className="flex min-h-screen bg-gray-50 font-inter">
		<div className="m-auto w-full max-w-2xl p-6 bg-white shadow-lg rounded-xl border border-gray-200">
			<div className="text-center mb-8">
				<Link to="/" className="inline-block mb-6">
					<img
						src={logo}
						alt="Godex Logo"
						className="h-8 w-auto"
						style={{ maxHeight: 32 }}
					/>
				</Link>
				<h2 className="text-2xl font-semibold text-black">{title}</h2>
				<p className="text-base text-gray-600 mt-2">{subtitle}</p>
			</div>
			{children}
		</div>
	</div>
);

export default AuthLayout;