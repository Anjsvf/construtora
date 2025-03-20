// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Lock } from 'lucide-react';

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({ email: '', password: '' });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: Implement actual authentication
//     navigate('/admin/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <Lock className="h-12 w-12 text-blue-600" />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
//           Área Administrativa
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={credentials.email}
//                   onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Senha
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={credentials.password}
//                   onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Entrar
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }