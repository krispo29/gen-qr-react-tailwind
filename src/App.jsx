import React, { useState, useEffect } from 'react';
import { Download, Copy, Share2, Smartphone, Mail, Phone, MessageSquare, Wifi, Type, Video, Users } from 'lucide-react';

const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState('URL');
  const [qrData, setQrData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [formData, setFormData] = useState({
    // URL
    url: '',
    
    // Contact
    firstName: '',
    lastName: '',
    organization: '',
    phone: '',
    email: '',
    website: '',
    
    // Email
    emailTo: '',
    subject: '',
    body: '',
    
    // SMS
    smsNumber: '',
    smsMessage: '',
    
    // WhatsApp
    whatsappNumber: '',
    whatsappMessage: '',
    
    // WiFi
    wifiName: '',
    wifiPassword: '',
    wifiSecurity: 'WPA',
    
    // Text
    textMessage: '',
    
    // LINE ID
    lineId: '',
    
    // Zoom
    zoomId: '',
    zoomPassword: '',
    
    // Teams
    teamsUrl: ''
  });

  const tabs = [
    { id: 'URL', label: 'URL', icon: <Smartphone size={16} /> },
    { id: 'Contact', label: 'Contact', icon: <Users size={16} /> },
    { id: 'Email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'Call', label: 'Call', icon: <Phone size={16} /> },
    { id: 'SMS', label: 'SMS', icon: <MessageSquare size={16} /> },
    { id: 'WhatsApp', label: 'WhatsApp', icon: <MessageSquare size={16} /> },
    { id: 'WiFi', label: 'WiFi', icon: <Wifi size={16} /> },
    { id: 'Text', label: 'ข้อความ', icon: <Type size={16} /> },
    { id: 'LINE', label: 'LINE ID', icon: <MessageSquare size={16} /> },
    { id: 'Zoom', label: 'Zoom', icon: <Video size={16} /> },
    { id: 'Teams', label: 'Teams', icon: <Users size={16} /> }
  ];

  const generateQRData = () => {
    let data = '';
    
    switch (activeTab) {
      case 'URL':
        data = formData.url;
        break;
      case 'Contact':
        data = `BEGIN:VCARD
VERSION:3.0
FN:${formData.firstName} ${formData.lastName}
ORG:${formData.organization}
TEL:${formData.phone}
EMAIL:${formData.email}
URL:${formData.website}
END:VCARD`;
        break;
      case 'Email':
        data = `mailto:${formData.emailTo}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.body)}`;
        break;
      case 'Call':
        data = `tel:${formData.phone}`;
        break;
      case 'SMS':
        data = `sms:${formData.smsNumber}?body=${encodeURIComponent(formData.smsMessage)}`;
        break;
      case 'WhatsApp':
        data = `https://wa.me/${formData.whatsappNumber}?text=${encodeURIComponent(formData.whatsappMessage)}`;
        break;
      case 'WiFi':
        data = `WIFI:T:${formData.wifiSecurity};S:${formData.wifiName};P:${formData.wifiPassword};;`;
        break;
      case 'Text':
        data = formData.textMessage;
        break;
      case 'LINE':
        data = `https://line.me/ti/p/${formData.lineId}`;
        break;
      case 'Zoom':
        data = `https://zoom.us/j/${formData.zoomId}?pwd=${formData.zoomPassword}`;
        break;
      case 'Teams':
        data = formData.teamsUrl;
        break;
      default:
        data = '';
    }
    
    return data;
  };

  const updateQRCode = () => {
    const data = generateQRData();
    setQrData(data);
    
    if (data) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
      setQrCodeUrl(qrUrl);
    } else {
      setQrCodeUrl('');
    }
  };

  useEffect(() => {
    updateQRCode();
  }, [formData, activeTab]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${activeTab.toLowerCase()}.png`;
      link.click();
    }
  };

  const copyQRData = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData);
      alert('คัดลอกข้อมูลแล้ว!');
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'URL':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'Contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">องค์กร</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เว็บไซต์</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'Email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ถึง</label>
              <input
                type="email"
                value={formData.emailTo}
                onChange={(e) => handleInputChange('emailTo', e.target.value)}
                placeholder="example@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
              <textarea
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'Call':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+66812345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'SMS':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร</label>
              <input
                type="tel"
                value={formData.smsNumber}
                onChange={(e) => handleInputChange('smsNumber', e.target.value)}
                placeholder="+66812345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
              <textarea
                value={formData.smsMessage}
                onChange={(e) => handleInputChange('smsMessage', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'WhatsApp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="66812345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
              <textarea
                value={formData.whatsappMessage}
                onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'WiFi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเครือข่าย (SSID)</label>
              <input
                type="text"
                value={formData.wifiName}
                onChange={(e) => handleInputChange('wifiName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
              <input
                type="password"
                value={formData.wifiPassword}
                onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ระบบรักษาความปลอดภัย</label>
              <select
                value={formData.wifiSecurity}
                onChange={(e) => handleInputChange('wifiSecurity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">ไม่มีรหัสผ่าน</option>
              </select>
            </div>
          </div>
        );

      case 'Text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
              <textarea
                value={formData.textMessage}
                onChange={(e) => handleInputChange('textMessage', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'LINE':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LINE ID</label>
              <input
                type="text"
                value={formData.lineId}
                onChange={(e) => handleInputChange('lineId', e.target.value)}
                placeholder="your-line-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'Zoom':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting ID</label>
              <input
                type="text"
                value={formData.zoomId}
                onChange={(e) => handleInputChange('zoomId', e.target.value)}
                placeholder="123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
              <input
                type="text"
                value={formData.zoomPassword}
                onChange={(e) => handleInputChange('zoomPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'Teams':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teams Meeting URL</label>
              <input
                type="url"
                value={formData.teamsUrl}
                onChange={(e) => handleInputChange('teamsUrl', e.target.value)}
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">สร้าง QR Code สำหรับข้อมูลประเภทต่างๆ</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                {renderForm()}
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-50 rounded-lg p-8 mb-4">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-center">
                        กรอกข้อมูลเพื่อสร้าง QR Code
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {qrCodeUrl && (
                  <div className="flex gap-3">
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download size={16} />
                      ดาวน์โหลด
                    </button>
                    <button
                      onClick={copyQRData}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Copy size={16} />
                      คัดลอก
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

       
      
      </div>
    </div>
  );
};

export default QRCodeGenerator;