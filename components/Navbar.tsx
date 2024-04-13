'use client';
import { useContext, useEffect, useState } from 'react'
import { TrackingContext } from '@/context/TrackingContext';
import { CiDeliveryTruck } from "react-icons/ci";
import { MdNavigateNext } from "react-icons/md";

interface NavbarProps {
  getShipmentCount: () => Promise<number>;
}

const Navbar: React.FC<NavbarProps> = ({getShipmentCount}) => {
  const [state, setState] = useState(false);
  const [count, setCount] = useState();
  const { currentUser, connectWallet } = useContext(TrackingContext);

  useEffect(() => {
    const getShipmentsData = getShipmentCount();
  
    const handleShipmentsData = async () => {
      const allData = await getShipmentsData;
      
      setCount(allData);
    };
  
    const handleOutsideClick = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn")) setState(false);
    };
  
    handleShipmentsData();
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <nav className="bg-white pt-8 md:text-sm mx-2 mt-2 md:mt-0">
      <div className='gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8'>
        <div className="flex items-center justify-between w-full">
          <a href="#" className='flex flex-row items-center'>
            <CiDeliveryTruck size={48} />
            <h1 className='font-bold sm:text-2xl'>Shipment Dapp</h1>
          </a>
          <div className='gap-x-6 items-center justify-end space-y-6 text-sm md:flex md:pace-y-0 md:mt-0 md:text-base'>
            {currentUser ? (
              <div className='flex md:flex-row flex-col gap-2'>
                <p className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-black rounded-lg border-2'>
                  Total Shipment: {count}
                </p>
                <p className='flex items-center justify-center gap-x-1 py-2 px-4 
                            text-white font-medium bg-gray-800 hover:bg-gray-700 
                              active:bg-gray-900 rounded-full md:inline-flex'
                >
                  {currentUser.slice(0, 25)}..
                </p>
              </div>
            ) : (
              <button
                onClick={() => connectWallet()}
                className='flex items-center justify-center gap-x-1 py-2 px-4 
                          text-white font-medium bg-gray-800 hover:bg-gray-700 
                          active:bg-gray-900 rounded-full md:inline-flex'
              >
                Connect Wallet
                <MdNavigateNext size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar