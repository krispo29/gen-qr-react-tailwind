import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Share2, Smartphone, Mail, Phone, MessageSquare, Wifi, Type, Video, Users, QrCode, Check, Sparkles } from 'lucide-react';

// Main App Component
const App = () => {
    const [activeTab, setActiveTab] = useState('URL');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const qrDataRef = useRef('');

    const [formData, setFormData] = useState({
        url: '',
        firstName: '',
        lastName: '',
        organization: '',
        phone: '',
        email: '',
        website: '',
        emailTo: '',
        subject: '',
        body: '',
        smsNumber: '',
        smsMessage: '',
        whatsappNumber: '',
        whatsappMessage: '',
        wifiName: '',
        wifiPassword: '',
        wifiSecurity: 'WPA',
        textMessage: '',
        lineId: '',
        zoomId: '',
        zoomPassword: '',
        teamsUrl: ''
    });

    const tabs = [
        { id: 'URL', label: 'URL', icon: <Smartphone size={18} />, color: 'from-blue-500 to-cyan-500' },
        { id: 'Contact', label: 'ข้อมูลติดต่อ', icon: <Users size={18} />, color: 'from-purple-500 to-pink-500' },
        { id: 'Email', label: 'อีเมล', icon: <Mail size={18} />, color: 'from-red-500 to-orange-500' },
        { id: 'Call', label: 'โทร', icon: <Phone size={18} />, color: 'from-green-500 to-teal-500' },
        { id: 'SMS', label: 'SMS', icon: <MessageSquare size={18} />, color: 'from-yellow-500 to-amber-500' },
        { id: 'WhatsApp', label: 'WhatsApp', icon: <MessageSquare size={18} />, color: 'from-green-400 to-emerald-500' },
        { id: 'WiFi', label: 'WiFi', icon: <Wifi size={18} />, color: 'from-indigo-500 to-purple-500' },
        { id: 'Text', label: 'ข้อความ', icon: <Type size={18} />, color: 'from-gray-500 to-slate-500' },
        { id: 'LINE', label: 'LINE ID', icon: <MessageSquare size={18} />, color: 'from-green-600 to-lime-500' },
        { id: 'Zoom', label: 'Zoom', icon: <Video size={18} />, color: 'from-blue-600 to-indigo-500' },
        { id: 'Teams', label: 'Teams', icon: <Users size={18} />, color: 'from-violet-500 to-purple-600' }
    ];

    useEffect(() => {
        const generateQRData = () => {
            let data = '';
            switch (activeTab) {
                case 'URL':
                    data = formData.url;
                    break;
                case 'Contact':
                    data = `MECARD:N:${formData.lastName},${formData.firstName};ORG:${formData.organization};TEL:${formData.phone};EMAIL:${formData.email};URL:${formData.website};;`;
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
                    data = `https://line.me/ti/p/~${formData.lineId}`;
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

        const data = generateQRData();
        qrDataRef.current = data;

        if (data) {
            setIsGenerating(true);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(data)}&qzone=1&margin=10`;
            
            // Add a small delay to show the loading animation
            setTimeout(() => {
                setQrCodeUrl(qrUrl);
                setIsGenerating(false);
            }, 300);
        } else {
            setQrCodeUrl('');
            setIsGenerating(false);
        }
    }, [formData, activeTab]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const downloadQRCode = () => {
        if (qrCodeUrl) {
            fetch(qrCodeUrl)
                .then(response => response.blob())
                .then(blob => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `qr-code-${activeTab.toLowerCase()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(console.error);
        }
    };

    const copyQRData = () => {
        if (!qrDataRef.current || isCopied) return;

        const textArea = document.createElement('textarea');
        textArea.value = qrDataRef.current;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const renderForm = () => {
        const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 placeholder-gray-400";
        const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
        const commonProps = {
            className: inputClass,
            onChange: (e) => handleInputChange(e.target.name, e.target.value)
        };

        const currentTab = tabs.find(tab => tab.id === activeTab);
        const gradientClass = `bg-gradient-to-r ${currentTab?.color}`;

        switch (activeTab) {
            case 'URL':
                return (
                    <div className="animate-fadeIn">
                        <label className={labelClass}>🌐 URL Address</label>
                        <input type="url" name="url" value={formData.url} {...commonProps} placeholder="https://example.com" />
                    </div>
                );
            case 'Contact':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>👤 ชื่อ</label>
                                <input type="text" name="firstName" value={formData.firstName} {...commonProps} placeholder="ชื่อ" />
                            </div>
                            <div>
                                <label className={labelClass}>📝 นามสกุล</label>
                                <input type="text" name="lastName" value={formData.lastName} {...commonProps} placeholder="นามสกุล" />
                            </div>
                        </div>
                        <div><label className={labelClass}>🏢 องค์กร</label><input type="text" name="organization" value={formData.organization} {...commonProps} placeholder="บริษัท/องค์กร" /></div>
                        <div><label className={labelClass}>📞 เบอร์โทร</label><input type="tel" name="phone" value={formData.phone} {...commonProps} placeholder="+66812345678" /></div>
                        <div><label className={labelClass}>📧 อีเมล</label><input type="email" name="email" value={formData.email} {...commonProps} placeholder="email@example.com" /></div>
                        <div><label className={labelClass}>🌐 เว็บไซต์</label><input type="url" name="website" value={formData.website} {...commonProps} placeholder="https://website.com" /></div>
                    </div>
                );
            case 'Email':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div><label className={labelClass}>📧 ถึง (อีเมล)</label><input type="email" name="emailTo" value={formData.emailTo} {...commonProps} placeholder="recipient@example.com" /></div>
                        <div><label className={labelClass}>📌 หัวข้อ</label><input type="text" name="subject" value={formData.subject} {...commonProps} placeholder="หัวข้ออีเมล" /></div>
                        <div><label className={labelClass}>💬 ข้อความ</label><textarea name="body" value={formData.body} {...commonProps} rows={4} placeholder="เขียนข้อความที่นี่..."></textarea></div>
                    </div>
                );
            case 'Call':
                return (
                    <div className="animate-fadeIn">
                        <label className={labelClass}>📞 เบอร์โทร</label>
                        <input type="tel" name="phone" value={formData.phone} {...commonProps} placeholder="+66812345678" />
                    </div>
                );
            case 'SMS':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div><label className={labelClass}>📱 เบอร์โทร</label><input type="tel" name="smsNumber" value={formData.smsNumber} {...commonProps} placeholder="+66812345678" /></div>
                        <div><label className={labelClass}>💬 ข้อความ</label><textarea name="smsMessage" value={formData.smsMessage} {...commonProps} rows={4} placeholder="พิมพ์ข้อความ SMS..."></textarea></div>
                    </div>
                );
            case 'WhatsApp':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div><label className={labelClass}>📱 เบอร์โทร (ไม่ต้องมี +)</label><input type="tel" name="whatsappNumber" value={formData.whatsappNumber} {...commonProps} placeholder="66812345678" /></div>
                        <div><label className={labelClass}>💬 ข้อความ</label><textarea name="whatsappMessage" value={formData.whatsappMessage} {...commonProps} rows={4} placeholder="Hello! 👋"></textarea></div>
                    </div>
                );
            case 'WiFi':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div><label className={labelClass}>📶 ชื่อเครือข่าย (SSID)</label><input type="text" name="wifiName" value={formData.wifiName} {...commonProps} placeholder="My WiFi Network" /></div>
                        <div><label className={labelClass}>🔒 รหัสผ่าน</label><input type="password" name="wifiPassword" value={formData.wifiPassword} {...commonProps} placeholder="••••••••" /></div>
                        <div>
                            <label className={labelClass}>🛡️ ระบบรักษาความปลอดภัย</label>
                            <select name="wifiSecurity" value={formData.wifiSecurity} {...commonProps}>
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">ไม่มีรหัสผ่าน</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Text':
                return (
                    <div className="animate-fadeIn">
                        <label className={labelClass}>💬 ข้อความ</label>
                        <textarea name="textMessage" value={formData.textMessage} {...commonProps} rows={6} placeholder="พิมพ์ข้อความของคุณที่นี่..."></textarea>
                    </div>
                );
            case 'LINE':
                return (
                    <div className="animate-fadeIn">
                        <label className={labelClass}>💚 LINE ID</label>
                        <input type="text" name="lineId" value={formData.lineId} {...commonProps} placeholder="your-line-id" />
                    </div>
                );
            case 'Zoom':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div><label className={labelClass}>🎥 Meeting ID</label><input type="text" name="zoomId" value={formData.zoomId} {...commonProps} placeholder="123456789" /></div>
                        <div><label className={labelClass}>🔒 รหัสผ่าน (ถ้ามี)</label><input type="text" name="zoomPassword" value={formData.zoomPassword} {...commonProps} placeholder="meeting password" /></div>
                    </div>
                );
            case 'Teams':
                return (
                    <div className="animate-fadeIn">
                        <label className={labelClass}>👥 Teams Meeting URL</label>
                        <input type="url" name="teamsUrl" value={formData.teamsUrl} {...commonProps} placeholder="https://teams.microsoft.com/l/meetup-join/..." />
                    </div>
                );
            default:
                return null;
        }
    };

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans text-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        QR Code Generator
                    </h1>
                 
                </header>

                <main className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex flex-col xl:flex-row overflow-hidden">
                    {/* Left Side: Form & Tabs */}
                    <div className="w-full xl:w-3/5 p-8 md:p-10">
                        <div className="flex flex-wrap gap-2 mb-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl border-2 ${
                                        activeTab === tab.id
                                            ? `bg-gradient-to-r ${tab.color} text-white border-transparent shadow-lg transform scale-105`
                                            : 'text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {currentTab?.label}
                            </h2>
                            <div className={`w-20 h-1 bg-gradient-to-r ${currentTab?.color} rounded-full`}></div>
                        </div>
                        
                        <div className="space-y-6">
                            {renderForm()}
                        </div>
                    </div>

                    {/* Right Side: QR Code Preview */}
                    <div className="w-full xl:w-2/5 bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 flex flex-col items-center justify-center border-t xl:border-t-0 xl:border-l border-gray-200">
                        <div className="w-full max-w-sm">
                            <div className="relative aspect-square bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-center transition-all duration-500 border-4 border-gray-100 hover:border-indigo-200">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                                        <p className="text-gray-500 font-medium">กำลังสร้าง QR Code...</p>
                                    </div>
                                ) : qrCodeUrl ? (
                                    <div className="relative group">
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="Generated QR Code" 
                                            className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all duration-300"></div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex flex-col items-center justify-center text-center p-6">
                                        <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                                            <QrCode size={48} className="text-indigo-500" />
                                        </div>
                                        <p className="text-gray-600 font-medium text-lg mb-2">
                                            พร้อมสร้าง QR Code
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            กรอกข้อมูลเพื่อเริ่มต้น
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {qrCodeUrl && (
                                <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fadeIn">
                                    <button
                                        onClick={downloadQRCode}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <Download size={20} />
                                        ดาวน์โหลด
                                    </button>
                                    <button
                                        onClick={copyQRData}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        {isCopied ? <Check size={20} /> : <Copy size={20} />}
                                        {isCopied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อมูล'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }
                
                .hover\\:scale-105:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default App;