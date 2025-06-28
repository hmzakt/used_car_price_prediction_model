import { useState } from 'react'
import './App.css'

const brands = [
  'Alfa', 'Aston', 'Audi', 'BMW', 'Bentley', 'Bugatti', 'Buick', 'Cadillac', 
  'Chevrolet', 'Chrysler', 'Dodge', 'FIAT', 'Ferrari', 'Ford', 'GMC', 
  'Genesis', 'Honda', 'Hummer', 'Hyundai', 'INFINITI', 'Jaguar', 'Jeep', 
  'Karma', 'Kia', 'Lamborghini', 'Land', 'Lexus', 'Lincoln', 'Lotus', 'MINI', 
  'Maserati', 'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mercury', 
  'Mitsubishi', 'Nissan', 'Plymouth', 'Pontiac', 'Porsche', 'RAM', 
  'Rolls-Royce', 'Saab', 'Saturn', 'Scion', 'Subaru', 'Suzuki', 'Toyota', 
  'Volkswagen', 'Volvo', 'smart'
];

// Models not in this list will be treated as 'Other'.
const modelToEncoding = {
  'F-150 XLT': 37,
  'Other': 33, 
  'Sierra 1500 SLT': 25,
  'Silverado 1500 LT': 24,
  'Grand Cherokee Laredo': 17,
  'Wrangler Unlimited Sport': 17,
  'Civic LX': 15,
  'Corolla LE': 15,
  'Accord EX-L': 14,
  'Camry SE': 14,
  'Explorer XLT': 13,
  'Mustang GT': 13,
  'Model 3 Long Range': 12,
  'Challenger SXT': 11,
  'Ram 1500 Big Horn': 11,
 
  'Utility Police Interceptor Base': 2,
  'Palisade SEL': 1,
  'RX 350 RX 350': 1,
  'Q50 Hybrid Sport': 1,
  'Q3 45 S line Premium Plus': 1,
  'ILX 2.4L': 1,
  'S3 2.0T Premium Plus': 1,
  '740 iL': 1,
  'RC 350 F Sport': 2,
  'Model X Long Range Plus': 1,
  'Rover Range Rover Sport 3.0 Supercharged HST': 1,
  'DBS Superleggera': 2,
  'Supra 3.0 Premium': 1,
  'Aviator Reserve AWD': 2,
};


function App() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    model_year: '',
    milage: '',
    fuel_type: '',
    transmission: '',
    engine_size: '',
    accident: '0',
    clean_title: '1',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError('');

    
    for (const key in formData) {
      if (formData[key] === '') {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
    }

    
    const apiPayload = {
      model_year: Number(formData.model_year),
      milage: Number(formData.milage),
      accident: Number(formData.accident),
      clean_title: Number(formData.clean_title),
      engine_size: Number(formData.engine_size),
     
      model_encoded: modelToEncoding[formData.model] || modelToEncoding['Other'],
    };

    
    const fuelTypes = ['Diesel', 'E85 Flex Fuel', 'Gasoline', 'Hybrid', 'Plug-In Hybrid'];
    fuelTypes.forEach(ft => {
      apiPayload[`fuel_type_${ft}`] = (formData.fuel_type === ft) ? 1 : 0;
    });

    
    const transmissions = ['Automatic', 'CVT', 'Manual'];
    transmissions.forEach(t => {
      apiPayload[`transmission_${t}`] = (formData.transmission === t) ? 1 : 0;
    });

    
    brands.forEach(b => {
      apiPayload[`brand_${b}`] = (formData.brand === b) ? 1 : 0;
    });

    try {
      const url = 'https://usedcarpricepredictionmodel-production.up.railway.app/predict';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the prediction.');
      }

      const result = await response.json();
      setPrediction(result.predicted_price);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <header className="w-full text-center py-4">
        <h1 className="text-4xl font-bold mb-8">Used Car Price Predictor</h1>
      </header>

      <main className="w-full max-w-2xl">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col">
              <label htmlFor="brand" className="mb-2 font-semibold">Brand</label>
              <select name="brand" id="brand" value={formData.brand} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="model" className="mb-2 font-semibold">Model</label>
              <input type="text" name="model" id="model" placeholder="e.g., Q50 Hybrid Sport" value={formData.model} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="model_year" className="mb-2 font-semibold">Model Year</label>
              <input type="number" name="model_year" id="model_year" placeholder="e.g., 2021" value={formData.model_year} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="milage" className="mb-2 font-semibold">Mileage (Miles run)</label>
              <input type="number" name="milage" id="milage" placeholder="e.g., 35000" value={formData.milage} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fuel_type" className="mb-2 font-semibold">Fuel Type</label>
              <select name="fuel_type" id="fuel_type" value={formData.fuel_type} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Fuel Type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="E85 Flex Fuel">E85 Flex Fuel</option>
                <option value="Plug-In Hybrid">Plug-In Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="transmission" className="mb-2 font-semibold">Transmission</label>
              <select name="transmission" id="transmission" value={formData.transmission} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="engine_size" className="mb-2 font-semibold">Engine Size (L)</label>
              <input type="number" step="0.1" name="engine_size" id="engine_size" placeholder="e.g., 3.5" value={formData.engine_size} onChange={handleChange} className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
             <div className="md:col-span-2 grid grid-cols-2 gap-x-6">
                <div className="flex items-center">
                    <input id="accident" name="accident" type="checkbox" checked={formData.accident === '1'} onChange={(e) => setFormData(prevState => ({ ...prevState, accident: e.target.checked ? '1' : '0' }))} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="accident" className="ml-2 block text-sm font-medium leading-6 text-white">Accident Reported</label>
                </div>
                <div className="flex items-center">
                    <input id="clean_title" name="clean_title" type="checkbox" checked={formData.clean_title === '1'} onChange={(e) => setFormData(prevState => ({ ...prevState, clean_title: e.target.checked ? '1' : '0' }))} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="clean_title" className="ml-2 block text-sm font-medium leading-6 text-white">Clean Title</label>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-400">
                {loading ? 'Predicting...' : 'Predict Price'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-3 bg-red-500 bg-opacity-20 text-red-300 border border-red-500 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {prediction && !error && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg text-center">
              <h2 className="text-2xl font-bold">Estimated Price</h2>
              <p className="text-3xl text-green-400 mt-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prediction)}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full text-center py-4 mt-8">
        <p className="text-gray-500">Built by HMZ</p>
      </footer>
    </div>
  )
}

export default App
