import React, { useState, useEffect, FC } from 'react';
import { Calculator, DollarSign, Users, Calendar, TrendingUp, Building, BookOpen, Clock, Settings } from 'lucide-react';

// Define interfaces for the state and props
interface Room {
  capacity: number;
  name: string;
}

interface RoomConfig {
  [key: string]: Room;
}

interface Variables {
  [key: string]: number;
}

interface MonthlyData {
  month: string;
  students: number;
  rentalHours: number;
  tutoringRevenue: number;
  rentalRevenue: number;
  totalRevenue: number;
  groups: number;
  teacherCosts: number;
  totalCosts: number;
  netProfit: number;
  adjustedStudentFee: number;
  adjustedRentalRate: number;
}

interface Summary {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  roi: number;
  remainingCapital: number;
  breakEvenMonth: number | string;
  averageMonthlyProfit: number;
  profitMargin: number;
}

interface Results {
  monthlyData?: MonthlyData[];
  summary?: Summary;
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  unit?: string;
  step?: string;
  min?: string;
  tooltip?: string;
}

const PremiumPlanCalculator: FC = () => {
  // Room Configuration - User adjustable
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    room1: { capacity: 10, name: 'Small Room 1' },
    room2: { capacity: 10, name: 'Small Room 2' }, 
    room3: { capacity: 20, name: 'Large Room' }
  });

  // All Financial Variables - User adjustable
  const [variables, setVariables] = useState<Variables>({
    // Investment & Setup
    totalInvestment: 20000,
    setupCosts: 8100,
    
    // Direct Tutoring Service
    studentFeePerMonth: 120,
    teacherCostPerHourPerGroup: 15,
    hoursPerGroupPerMonth: 16,
    studentsPerGroup: 10,
    
    // Room Rental Service  
    roomRentalRatePerHour: 15,
    
    // Operating Costs
    monthlyRent: 2500,
    directorSalary: 1200,
    utilities: 200,
    miscCosts: 160,
    insurance: 100,
    marketing: 300,
    maintenance: 150,
    
    // Growth Assumptions - Students
    sept2025Students: 18,
    oct2025Students: 22,
    nov2025Students: 26,
    dec2025Students: 30,
    
    // Growth Assumptions - Rental Hours
    sept2025RentalHours: 80,
    oct2025RentalHours: 120,
    nov2025RentalHours: 150,
    dec2025RentalHours: 200,
    
    // Service Mix Percentages
    tutoringServicePercentage: 70,
    rentalServicePercentage: 30,
    
    // Pricing Strategy
    premiumServiceMultiplier: 1.0,
    discountForLargeGroups: 0,
    seasonalPricingBonus: 0,
    
    // Operational Efficiency
    teacherUtilizationRate: 85,
    roomUtilizationRate: 75,
    administrativeEfficiencyRate: 90,
    
    // Additional Revenue Streams
    materialsFeePerStudent: 20,
    registrationFeePerStudent: 50,
    examPrepBonusPerStudent: 30,
    
    // Cost Optimization
    bulkDiscountOnSupplies: 5,
    energyEfficiencyDiscount: 10,
    staffProductivityBonus: 200
  });

  const [results, setResults] = useState<Results>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Calculate financial projections
  useEffect(() => {
    const months = [
      { name: 'September 2025', students: variables.sept2025Students, rentalHours: variables.sept2025RentalHours },
      { name: 'October 2025', students: variables.oct2025Students, rentalHours: variables.oct2025RentalHours },
      { name: 'November 2025', students: variables.nov2025Students, rentalHours: variables.nov2025RentalHours },
      { name: 'December 2025', students: variables.dec2025Students, rentalHours: variables.dec2025RentalHours }
    ];

    const calculations: MonthlyData[] = months.map(month => {
      // Apply premium service multiplier and seasonal bonus
      const adjustedStudentFee = variables.studentFeePerMonth * variables.premiumServiceMultiplier * (1 + variables.seasonalPricingBonus / 100);
      const adjustedRentalRate = variables.roomRentalRatePerHour * variables.premiumServiceMultiplier;
      
      // Direct Tutoring Revenue
      const baseTutoringRevenue = month.students * adjustedStudentFee;
      const materialsRevenue = month.students * variables.materialsFeePerStudent;
      const registrationRevenue = month.students * variables.registrationFeePerStudent * 0.25; // Spread over 4 months
      const examPrepRevenue = month.students * variables.examPrepBonusPerStudent * 0.5; // 50% take exam prep
      const tutoringRevenue = baseTutoringRevenue + materialsRevenue + registrationRevenue + examPrepRevenue;
      
      // Room Rental Revenue
      const adjustedRentalHours = month.rentalHours * (variables.roomUtilizationRate / 100);
      const rentalRevenue = adjustedRentalHours * adjustedRentalRate;
      
      // Total Revenue
      const totalRevenue = tutoringRevenue + rentalRevenue;
      
      // Calculate teacher groups needed
      const groups = Math.ceil(month.students / variables.studentsPerGroup);
      const adjustedTeacherHours = variables.hoursPerGroupPerMonth * (variables.teacherUtilizationRate / 100);
      const teacherCosts = groups * adjustedTeacherHours * variables.teacherCostPerHourPerGroup;
      
      // Apply discounts and efficiency improvements
      const discountedTeacherCosts = teacherCosts * (1 - variables.discountForLargeGroups / 100);
      
      // Operating Costs with efficiency adjustments
      const adjustedUtilities = variables.utilities * (1 - variables.energyEfficiencyDiscount / 100);
      const adjustedMiscCosts = variables.miscCosts * (1 - variables.bulkDiscountOnSupplies / 100);
      const adjustedRent = variables.monthlyRent;
      const adjustedDirectorSalary = variables.directorSalary + (variables.staffProductivityBonus * (variables.administrativeEfficiencyRate / 100) / 100);
      
      // Total Operating Costs
      const totalCosts = adjustedRent + adjustedDirectorSalary + discountedTeacherCosts + 
                        adjustedUtilities + adjustedMiscCosts + variables.insurance + 
                        variables.marketing + variables.maintenance;
      
      // Net Profit
      const netProfit = totalRevenue - totalCosts;
      
      return {
        month: month.name,
        students: month.students,
        rentalHours: month.rentalHours,
        tutoringRevenue,
        rentalRevenue,
        totalRevenue,
        groups,
        teacherCosts: discountedTeacherCosts,
        totalCosts,
        netProfit,
        adjustedStudentFee,
        adjustedRentalRate
      };
    });

    const totalRevenue = calculations.reduce((sum, month) => sum + month.totalRevenue, 0);
    const totalCosts = calculations.reduce((sum, month) => sum + month.totalCosts, 0);
    const totalProfit = totalRevenue - totalCosts;
    const roi = ((totalProfit / variables.totalInvestment) * 100);
    const remainingCapital = variables.totalInvestment - variables.setupCosts;
    const breakEvenMonth = calculations.findIndex(month => month.netProfit >= 0) + 1;

    setResults({
      monthlyData: calculations,
      summary: {
        totalRevenue,
        totalCosts,
        totalProfit,
        roi,
        remainingCapital,
        breakEvenMonth: breakEvenMonth > 0 ? breakEvenMonth : 'Not within 4 months',
        averageMonthlyProfit: totalProfit / 4,
        profitMargin: (totalProfit / totalRevenue) * 100
      }
    });
  }, [variables, roomConfig]);

  const updateVariable = (key: keyof Variables, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const updateRoomCapacity = (room: keyof RoomConfig, capacity: string) => {
    setRoomConfig(prev => ({
      ...prev,
      [room]: { ...prev[room], capacity: parseInt(capacity) || 0 }
    }));
  };

  const updateRoomName = (room: keyof RoomConfig, name: string) => {
    setRoomConfig(prev => ({
      ...prev,
      [room]: { ...prev[room], name: name }
    }));
  };

  const totalCapacity = Object.values(roomConfig).reduce((sum, room) => sum + room.capacity, 0);

  // Input component for reusability
  const NumberInput: FC<NumberInputProps> = ({ label, value, onChange, unit = 'TND', step = '1', min = '0', tooltip }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1" title={tooltip}>
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          min={min}
          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {unit && (
          <span className="absolute right-3 top-2 text-sm text-gray-500">{unit}</span>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', name: 'Basic Settings', icon: Settings },
    { id: 'rooms', name: 'Room Config', icon: Building },
    { id: 'services', name: 'Services', icon: BookOpen },
    { id: 'projections', name: 'Projections', icon: Calendar },
    { id: 'costs', name: 'Operating Costs', icon: DollarSign },
    { id: 'advanced', name: 'Advanced', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calculator className="w-8 h-8" />
                ELMAOUIA ET.CO - Advanced Premium Calculator
              </h1>
              <p className="text-blue-100 mt-2">Complete Financial Projection: September - December 2025</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Total Capacity</p>
              <p className="text-2xl font-bold">{totalCapacity} Students</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Settings Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment & Basic Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumberInput
                  label="Total Investment"
                  value={variables.totalInvestment}
                  onChange={(value) => updateVariable('totalInvestment', value)}
                  tooltip="Initial capital available for the business"
                />
                <NumberInput
                  label="Setup Costs"
                  value={variables.setupCosts}
                  onChange={(value) => updateVariable('setupCosts', value)}
                  tooltip="One-time costs for relocation and setup"
                />
                <NumberInput
                  label="Students Per Group"
                  value={variables.studentsPerGroup}
                  onChange={(value) => updateVariable('studentsPerGroup', value)}
                  unit="students"
                  tooltip="Average number of students per teaching group"
                />
              </div>
            </div>
          )}

          {/* Room Configuration Tab */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Room Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(roomConfig).map(([key, room]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoomName(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <NumberInput
                        label="Capacity"
                        value={room.capacity}
                        onChange={(value) => updateRoomCapacity(key, value)}
                        unit="students"
                        tooltip={`Maximum number of students for ${room.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Direct Tutoring Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberInput
                    label="Student Fee per Month"
                    value={variables.studentFeePerMonth}
                    onChange={(value) => updateVariable('studentFeePerMonth', value)}
                    tooltip="Base monthly fee per student"
                  />
                  <NumberInput
                    label="Teacher Cost per Hour per Group"
                    value={variables.teacherCostPerHourPerGroup}
                    onChange={(value) => updateVariable('teacherCostPerHourPerGroup', value)}
                    tooltip="Cost to pay teacher per hour per group"
                  />
                  <NumberInput
                    label="Hours per Group per Month"
                    value={variables.hoursPerGroupPerMonth}
                    onChange={(value) => updateVariable('hoursPerGroupPerMonth', value)}
                    unit="hours"
                    tooltip="Total teaching hours per group monthly"
                  />
                  <NumberInput
                    label="Materials Fee per Student"
                    value={variables.materialsFeePerStudent}
                    onChange={(value) => updateVariable('materialsFeePerStudent', value)}
                    tooltip="Additional materials fee per student"
                  />
                  <NumberInput
                    label="Registration Fee per Student"
                    value={variables.registrationFeePerStudent}
                    onChange={(value) => updateVariable('registrationFeePerStudent', value)}
                    tooltip="One-time registration fee (spread over 4 months)"
                  />
                  <NumberInput
                    label="Exam Prep Bonus per Student"
                    value={variables.examPrepBonusPerStudent}
                    onChange={(value) => updateVariable('examPrepBonusPerStudent', value)}
                    tooltip="Additional fee for exam preparation (50% participation assumed)"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Room Rental Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput
                    label="Room Rental Rate per Hour"
                    value={variables.roomRentalRatePerHour}
                    onChange={(value) => updateVariable('roomRentalRatePerHour', value)}
                    tooltip="Hourly rate for independent teachers"
                  />
                  <NumberInput
                    label="Room Utilization Rate"
                    value={variables.roomUtilizationRate}
                    onChange={(value) => updateVariable('roomUtilizationRate', value)}
                    unit="%"
                    tooltip="Expected utilization percentage of available hours"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Projections Tab */}
          {activeTab === 'projections' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Growth Projections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { month: 'September', studentsKey: 'sept2025Students', hoursKey: 'sept2025RentalHours' },
                  { month: 'October', studentsKey: 'oct2025Students', hoursKey: 'oct2025RentalHours' },
                  { month: 'November', studentsKey: 'nov2025Students', hoursKey: 'nov2025RentalHours' },
                  { month: 'December', studentsKey: 'dec2025Students', hoursKey: 'dec2025RentalHours' }
                ].map(({ month, studentsKey, hoursKey }) => (
                  <div key={month} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">{month} 2025</h4>
                    <div className="space-y-3">
                      <NumberInput
                        label="Students"
                        value={variables[studentsKey]}
                        onChange={(value) => updateVariable(studentsKey, value)}
                        unit="students"
                      />
                      <NumberInput
                        label="Rental Hours"
                        value={variables[hoursKey]}
                        onChange={(value) => updateVariable(hoursKey, value)}
                        unit="hours"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operating Costs Tab */}
          {activeTab === 'costs' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Operating Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberInput
                  label="Monthly Rent"
                  value={variables.monthlyRent}
                  onChange={(value) => updateVariable('monthlyRent', value)}
                  tooltip="Monthly facility rent"
                />
                <NumberInput
                  label="Director Salary"
                  value={variables.directorSalary}
                  onChange={(value) => updateVariable('directorSalary', value)}
                  tooltip="Monthly salary for director"
                />
                <NumberInput
                  label="Utilities"
                  value={variables.utilities}
                  onChange={(value) => updateVariable('utilities', value)}
                  tooltip="Electricity, water, internet"
                />
                <NumberInput
                  label="Insurance"
                  value={variables.insurance}
                  onChange={(value) => updateVariable('insurance', value)}
                  tooltip="Monthly insurance costs"
                />
                <NumberInput
                  label="Marketing"
                  value={variables.marketing}
                  onChange={(value) => updateVariable('marketing', value)}
                  tooltip="Monthly marketing budget"
                />
                <NumberInput
                  label="Maintenance"
                  value={variables.maintenance}
                  onChange={(value) => updateVariable('maintenance', value)}
                  tooltip="Facility maintenance and repairs"
                />
                <NumberInput
                  label="Miscellaneous Costs"
                  value={variables.miscCosts}
                  onChange={(value) => updateVariable('miscCosts', value)}
                  tooltip="Other operational expenses"
                />
                <NumberInput
                  label="Staff Productivity Bonus"
                  value={variables.staffProductivityBonus}
                  onChange={(value) => updateVariable('staffProductivityBonus', value)}
                  tooltip="Performance-based bonus for staff"
                />
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Pricing Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberInput
                    label="Premium Service Multiplier"
                    value={variables.premiumServiceMultiplier}
                    onChange={(value) => updateVariable('premiumServiceMultiplier', value)}
                    unit="x"
                    step="0.1"
                    tooltip="Multiply base prices for premium positioning"
                  />
                  <NumberInput
                    label="Large Group Discount"
                    value={variables.discountForLargeGroups}
                    onChange={(value) => updateVariable('discountForLargeGroups', value)}
                    unit="%"
                    tooltip="Discount percentage for larger groups"
                  />
                  <NumberInput
                    label="Seasonal Pricing Bonus"
                    value={variables.seasonalPricingBonus}
                    onChange={(value) => updateVariable('seasonalPricingBonus', value)}
                    unit="%"
                    tooltip="Seasonal price increase percentage"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Operational Efficiency</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberInput
                    label="Teacher Utilization Rate"
                    value={variables.teacherUtilizationRate}
                    onChange={(value) => updateVariable('teacherUtilizationRate', value)}
                    unit="%"
                    tooltip="Percentage of scheduled teaching hours actually delivered"
                  />
                  <NumberInput
                    label="Administrative Efficiency Rate"
                    value={variables.administrativeEfficiencyRate}
                    onChange={(value) => updateVariable('administrativeEfficiencyRate', value)}
                    unit="%"
                    tooltip="Administrative efficiency affecting productivity bonus"
                  />
                  <NumberInput
                    label="Energy Efficiency Discount"
                    value={variables.energyEfficiencyDiscount}
                    onChange={(value) => updateVariable('energyEfficiencyDiscount', value)}
                    unit="%"
                    tooltip="Percentage reduction in utility costs from efficiency measures"
                  />
                  <NumberInput
                    label="Bulk Discount on Supplies"
                    value={variables.bulkDiscountOnSupplies}
                    onChange={(value) => updateVariable('bulkDiscountOnSupplies', value)}
                    unit="%"
                    tooltip="Discount percentage from bulk purchasing"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Section - Always Visible */}
          {results.monthlyData && (
            <div className="mt-8 border-t pt-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-500 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold">{results.summary?.totalRevenue?.toLocaleString()} TND</p>
                  <p className="text-green-100 text-sm">Sept - Dec 2025</p>
                </div>
                <div className="bg-red-500 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Total Costs</h3>
                  <p className="text-3xl font-bold">{results.summary?.totalCosts?.toLocaleString()} TND</p>
                  <p className="text-red-100 text-sm">4 months operation</p>
                </div>
                <div className="bg-blue-500 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
                  <p className="text-3xl font-bold">{results.summary?.totalProfit?.toLocaleString()} TND</p>
                  <p className="text-blue-100 text-sm">Profit Margin: {results.summary?.profitMargin?.toFixed(1)}%</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">ROI</h3>
                  <p className="text-3xl font-bold">{results.summary?.roi?.toFixed(1)}%</p>
                  <p className="text-purple-100 text-sm">Break-even: Month {results.summary?.breakEvenMonth}</p>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Monthly Financial Breakdown (Sept - Dec 2025)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutoring Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Costs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.monthlyData.map((month, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{month.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{month.students}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{month.rentalHours}h</td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">{month.tutoringRevenue.toLocaleString()} TND</td>
                          <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{month.rentalRevenue.toLocaleString()} TND</td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-700 font-bold">{month.totalRevenue.toLocaleString()} TND</td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{month.totalCosts.toLocaleString()} TND</td>
                          <td className={`px-6 py-4 whitespace-nowrap font-bold ${month.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {month.netProfit >= 0 ? '+' : ''}{month.netProfit.toLocaleString()} TND
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumPlanCalculator;