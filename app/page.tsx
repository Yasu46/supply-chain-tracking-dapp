'use client';
import CompleteShipment from "@/components/CompleteShipment";
import TrackingForm from "@/components/TrackingForm";
import GetShipment from "@/components/GetShipment";
import Services from "@/components/Services";
import StartShipment from "@/components/StartShipment";
import TrackingTable from "@/components/TrackingTable";
import Navbar from "@/components/Navbar";
import { TrackingContext } from "@/context/TrackingContext";
import { useContext, useEffect, useState } from "react";
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

interface ShipmentItems {
  receiver: string;
  pickupTime: string;
  distance: string;
  price: string;
}

interface shipmentParams {
  receiver: string;
  index: number;
}

interface TrackingContextValue {
  createShipment: (shipmentData: ShipmentItems) => Promise<void>;
  getAllShipments: () => Promise<ShipmentData[]>;
  completeShipment: (shipmentData: shipmentParams) => Promise<void>;
  getShipment: (index: number) => Promise<ShipmentData>;
  startShipment: (shipmentData: shipmentParams) => Promise<void>;
  getShipmentCount: () => Promise<number>;
}

export default function Home() {
  const {
    createShipment,
    getAllShipments,
    completeShipment,
    getShipment,
    startShipment,
    getShipmentCount
  } = useContext(TrackingContext) as TrackingContextValue
  // STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [startModel, setStartModel] = useState(false);
  const [completeModel, setCompleteModel] = useState(false);
  const [getModel, setGetModel] = useState(false)
  // DATA STATE VARIABLE
  const [allShipmentsData, setAllShipmentsData] = useState<ShipmentData[]>([]);

  useEffect(() => {
    const getCampaignsData = getAllShipments();
    const fetchData = async () => {
      const allData: ShipmentData[] = await getCampaignsData;
      setAllShipmentsData(allData);
    };
    fetchData();
  }, []);
  return (
    <main className="pb-24">
      <Navbar
        getShipmentCount={getShipmentCount}
      />
      <Services
        setCompleteModel={setCompleteModel}
        setGetModel={setGetModel}
        setStartModel={setStartModel}
      />
      <TrackingTable
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentsData={allShipmentsData}
      />
      <TrackingForm
        createShipmentModel={createShipmentModel}
        createShipment={createShipment}
        setCreateShipmentModel={setCreateShipmentModel}
      />
      <CompleteShipment
        completeModel={completeModel}
        setCompleteModel={setCompleteModel}
        completeShipment={completeShipment}
      />
      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
        getShipment={getShipment}
      />
      <StartShipment
        startModel={startModel}
        setStartModel={setStartModel}
        startShipment={startShipment}
      />
    </main>
  );
}
