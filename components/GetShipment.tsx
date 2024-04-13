import { useState } from 'react'
import { MdCancel } from "react-icons/md";

interface GetShipmentProps {
  getModel: boolean;
  setGetModel: (value: boolean) => void;
  getShipment: (index: string | number) => Promise<ShipmentData>;
}

interface ShipmentData {
  sender: string;
  receiver: string;
  price: string;
  pickupTime: number;
  deliveryTime: number;
  distance: number;
  isPaid: boolean;
  status: number;
}

const GetShipment: React.FC<GetShipmentProps> = ({ getModel, setGetModel, getShipment }) => {
  const [index, setIndex] = useState(0);
  const [singleShipmentData, setSingleShipmentData] = useState<ShipmentData>();

  const getShipmentData = async () => {
    const getData = await getShipment(index);
    
    setSingleShipmentData(getData);
  }

  const convertTime = (time: number) => {
    const newTime = new Date(time);
    const dataTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newTime);
    return dataTime;
  }
  return getModel ? (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='fixed inset-0 w-full h-full bg-black opacity-40'
        onClick={() => setGetModel(false)}
      ></div>
      <div className='flex items-center min-h-screen px-4 py-8'>
        <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
          <div className='flex justify-end'>
            <button>
              <MdCancel onClick={() => setGetModel(false)} size={32} className='cursor-pointer' />
            </button>
          </div>
          <div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
            <h4 className='text-lg font-medium text-gray-800'>
              Product Tracking Details
            </h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='relative mt-3'>
                <input
                  type="number"
                  placeholder='ID'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent online-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setIndex(Number(e.target.value))}
                />
              </div>
              <button
                onClick={() => getShipmentData()}
                className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600
                            hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'
              >
                Get Details
              </button>
            </form>
            {singleShipmentData == undefined ? (
              <div className='font-bold text-red-500 text-lg'>No Shipment Data</div>
            ) : (
              <div className='text-left'>
                <p>Sender: {singleShipmentData.sender.slice(0, 25)}...</p>
                <p>Receiver: {singleShipmentData.receiver.slice(0, 25)}...</p>
                <p>Pickup Time: {convertTime(singleShipmentData.pickupTime)}</p>
                <p>Delivery Time: {singleShipmentData.deliveryTime}</p>
                <p>Distance: {singleShipmentData.distance}</p>
                <p>Price: {singleShipmentData.price}</p>
                <p>Status: {singleShipmentData.status}</p>
                <p>Paid: {singleShipmentData.isPaid ? " Completed" : "Not Complete"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  )
}

export default GetShipment