import React from "react";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

const AuthLayout = ({ title, subtitle, children }: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}) => (
	<div className="flex min-h-screen bg-gray-50 font-inter">
		<div className="m-auto w-full max-w-2xl p-6 bg-white shadow-lg rounded-xl border border-gray-200">
			<div className="text-center mb-8">
				<div className="mb-6 flex justify-center">
					<BrandWordmark />
				</div>
				<h2 className="text-2xl font-semibold text-black">{title}</h2>
				<p className="text-base text-gray-600 mt-2">{subtitle}</p>
			</div>
			{children}
		</div>
	</div>
);

export default AuthLayout;