import { useState } from 'react';
import Layout from './components/Layout';
import Overview from './components/Overview';
import TruckFleet from './components/TruckFleet';
import Pipeline from './components/Pipeline';
import Vessel from './components/Vessel';
import AlertCenter from './components/AlertCenter';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTruck, setSelectedTruck] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'pipeline':
        return <Pipeline />;
      case 'trucks':
        return (
          <TruckFleet
            selectedTruck={selectedTruck}
            setSelectedTruck={setSelectedTruck}
          />
        );
      case 'vessels':
        return <Vessel />;
      case 'alerts':
        return <AlertCenter />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
