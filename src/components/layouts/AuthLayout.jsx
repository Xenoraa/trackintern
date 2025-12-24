import { Outlet } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gray-900 p-3 rounded-lg">
            <FiShield className="text-white" size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          InternTrack SIWES
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Student Industrial Work Experience Scheme
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
          <Outlet />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Baze University • SIWES Program
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;