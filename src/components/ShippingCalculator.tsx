import React, { useState } from 'react';
// Language context - using simple state for now
const useLanguageContext = () => ({ language: 'en' });
import { Calculator, MapPin, Package, Clock, Truck, Phone, Mail } from 'lucide-react';
import { IMAGES } from '@/assets/images';

export default function ShippingCalculator() {
  const { language } = useLanguageContext();
  
  const [formData, setFormData] = useState({
    origin: 'Yangon',
    destinationRegion: '',
    township: '',
    weight: '',
    length: '',
    width: '',
    height: ''
  });

  const [calculatedRate, setCalculatedRate] = useState<{
    price: string;
    time: string;
    note: string;
  } | null>(null);

  const yangonTownships = {
    central: [
      'Ahlone', 'Bahan', 'Botahtaung', 'Dagon', 'Dawbon', 'Hlaing',
      'Insein', 'Kamaryut', 'Kyauktada', 'Kyimyindaing', 'Lanmataw',
      'Latha', 'Mayangone', 'Mingalar Taung Nyunt', 'North Okkalapa',
      'Pabedan', 'Pazundaung', 'Sanchaung', 'South Oakkalapa', 'Tamwe',
      'Thaketa', 'Thingangyun', 'Yankin'
    ],
    extended: [
      'Dagon Seikken', 'East Dagon', 'Hlaing Thar Yar', 'Mingalar Don',
      'North Dagon', 'Shwe Paukkan', 'Shwe Pyi Thar', 'South Dagon'
    ],
    suburban: [
      'Htauk Kyant', 'Hlegu', 'Hmawbi', 'Lay Daung Kan', 'Thanlyin'
    ]
  };

  const calculateRate = () => {
    const weight = parseFloat(formData.weight) || 0;
    let baseRate = 0;
    let timeEstimate = '';
    let note = '';

    if (formData.destinationRegion === 'yangon') {
      if (yangonTownships.central.includes(formData.township)) {
        baseRate = 2000;
        timeEstimate = 'Same Day';
        note = 'Central Yangon - Premium Service';
      } else if (yangonTownships.extended.includes(formData.township)) {
        baseRate = 2500;
        timeEstimate = 'Same Day';
        note = 'Extended Yangon Areas';
      } else if (yangonTownships.suburban.includes(formData.township)) {
        baseRate = 3000;
        timeEstimate = 'Next Day';
        note = 'Suburban Areas';
      }
    } else if (formData.destinationRegion === 'mandalay') {
      baseRate = 4500;
      timeEstimate = 'Next Day';
      note = 'Mandalay Region Express';
    } else if (formData.destinationRegion === 'naypyitaw') {
      baseRate = 4000;
      timeEstimate = 'Next Day';
      note = 'Capital Express Service';
    } else {
      baseRate = 5500;
      timeEstimate = '2-3 Days';
      note = 'Other States/Regions';
    }

    // Additional weight charges
    if (weight > 1) {
      baseRate += (weight - 1) * 500;
    }

    setCalculatedRate({
      price: `${baseRate.toLocaleString()} MMK`,
      time: timeEstimate,
      note: `${note}. Base rate covers 1st Kg. Additional weight +500 MMK/Kg.`
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'destinationRegion' && value !== 'yangon') {
      setFormData(prev => ({ ...prev, township: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header */}
      <header className="bg-navy-900/90 backdrop-blur-sm border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Britium Express</h1>
                <p className="text-gold-400 text-sm">Premium Logistics Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+95-9-897447744</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@britiumexpress.com</span>
              </div>
              <div className="text-xs">
                Mon-Sat: 9:00am - 5:30pm
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-navy-800/50 backdrop-blur-sm border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex space-x-8">
              {['Home', 'Track & Trace', 'Services', 'Get Quote', 'About Us', 'News', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-gray-300 hover:text-gold-400 transition-colors text-sm font-medium">
                  {item}
                </a>
              ))}
            </div>
            <button className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-navy-900 to-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-6">
            <Calculator className="w-5 h-5 text-gold-400" />
            <span className="text-gold-400 font-medium">Shipping Rate Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Check our specific Yangon City rates below.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            ရန်ကုန်မြို့တွင်း ပို့ဆောင်ခ နှုန်းထားများကို စစ်ဆေးပါ
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="space-y-8">
              <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Package className="w-6 h-6 text-gold-400" />
                  <h2 className="text-2xl font-bold text-white">📦 Shipment Details</h2>
                </div>
                <p className="text-gray-300 mb-8">Enter your package information to get an instant quote</p>

                <div className="space-y-6">
                  {/* Origin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Origin / မူလနေရာ
                    </label>
                    <div className="bg-navy-700/50 border border-gold-500/20 rounded-lg px-4 py-3">
                      <span className="text-white">From: Yangon / မှ: ရန်ကုန်</span>
                    </div>
                  </div>

                  {/* Destination Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Destination Region / ဦးတည်ရာ ဒေသ
                    </label>
                    <select
                      value={formData.destinationRegion}
                      onChange={(e) => handleInputChange('destinationRegion', e.target.value)}
                      className="form-elegant w-full"
                    >
                      <option value="">Select Region / ဒေသ ရွေးချယ်ရန်</option>
                      <option value="yangon">Yangon City / ရန်ကုန်မြို့</option>
                      <option value="mandalay">Mandalay Region / မန္တလေးတိုင်း</option>
                      <option value="naypyitaw">Nay Pyi Taw / နေပြည်တော်</option>
                      <option value="other">Other States/Regions / အခြား ပြည်နယ်/တိုင်းများ</option>
                    </select>
                  </div>

                  {/* Township Selection */}
                  {formData.destinationRegion === 'yangon' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Township / မြို့နယ် ရွေးချယ်ရန်
                      </label>
                      <select
                        value={formData.township}
                        onChange={(e) => handleInputChange('township', e.target.value)}
                        className="form-elegant w-full"
                      >
                        <option value="">-- Select Area / ဧရိယာ ရွေးရန် --</option>
                        <optgroup label="Central Yangon / ရန်ကုန်မြို့လယ်">
                          {yangonTownships.central.map(township => (
                            <option key={township} value={township}>{township}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Extended Areas / တိုးချဲ့ဧရိယာများ">
                          {yangonTownships.extended.map(township => (
                            <option key={township} value={township}>{township}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Suburban / မြို့ပြင်ဧရိယာများ">
                          {yangonTownships.suburban.map(township => (
                            <option key={township} value={township}>{township}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  )}

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (Kg) / အလေးချိန် (ကီလိုဂရမ်)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="form-elegant w-full"
                      placeholder="Enter weight / အလေးချိန် ထည့်ရန်"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dimensions (L x W x H cm) - Optional / အရွယ်အစား (ရှည် x နံ x မြင့် စင်တီမီတာ) - ရွေးချယ်ရန်
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        className="form-elegant"
                        placeholder="Length"
                      />
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        className="form-elegant"
                        placeholder="Width"
                      />
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="form-elegant"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <button
                    onClick={calculateRate}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Calculator className="w-5 h-5 inline mr-2" />
                    Calculate Rate / নুন্ধাথা তওকচাকরান
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
              <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">💰</span>
                  <h2 className="text-2xl font-bold text-white">Estimated Delivery Cost</h2>
                </div>
                <p className="text-gray-300 mb-8">Your shipping quote will appear here</p>

                {calculatedRate ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gold-400 mb-2">
                        {calculatedRate.price}
                      </div>
                      <p className="text-gray-300">
                        Estimated Delivery Time: {calculatedRate.time}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {calculatedRate.note}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-gold-500/20">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Service Type</div>
                        <div className="text-white font-medium">Express Delivery</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Insurance</div>
                        <div className="text-white font-medium">Included</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Tracking</div>
                        <div className="text-white font-medium">Real-time</div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300">
                      BOOK NOW / ယခုပင် မှာယူရန်
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      Select a destination and enter weight to see pricing
                    </p>
                    <p className="text-gray-500 text-sm">
                      ဦးတည်ရာနေရာနှင့် အလေးချိန်ကို ရွေးချယ်ပြီး ဈေးနှုန်းကို ကြည့်ရှုပါ
                    </p>
                  </div>
                )}
              </div>

              {/* Service Features */}
              <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  Why Choose Britium Express?
                </h3>
                <p className="text-gray-300 mb-6">
                  Premium logistics services with Myanmar's golden standard
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gold-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Door-to-Door</h4>
                      <p className="text-sm text-gray-400">We pick up from your doorstep and deliver directly to the receiver. No need to visit a station.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gold-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Secure Handling</h4>
                      <p className="text-sm text-gray-400">From documents to fragile parcels, our trained staff ensures your items arrive intact.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gold-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Real-Time Updates</h4>
                      <p className="text-sm text-gray-400">Track your shipment status via our Website or Mobile App at any time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-gold-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Britium Express</h3>
              <p className="text-gray-400 text-sm">
                A dedicated delivery arm of Britium Ventures Company Limited. Providing fast, secure, and compliant logistics solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-gray-400 hover:text-gold-400 block">Track Package</a>
                <a href="#" className="text-gray-400 hover:text-gold-400 block">Services</a>
                <a href="#" className="text-gray-400 hover:text-gold-400 block">Get Quote</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Reach Out</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Britium Ventures Company Limited, YANGON, Yangon 11451 My.</p>
                <p>+95-9-897447744, +95-9-897447755</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gold-500/20 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 Britium Ventures Company Limited. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}