import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Calendar } from 'lucide-react';

export default function CheckYourAgePage() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [calculateAsOf, setCalculateAsOf] = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);
  const [error, setError] = useState('');

  const calculateAge = () => {
    setError('');
    setResult(null);

    if (!dateOfBirth || !calculateAsOf) {
      setError('Please provide both dates');
      return;
    }

    const dob = new Date(dateOfBirth);
    const asOf = new Date(calculateAsOf);

    if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) {
      setError('Invalid date format');
      return;
    }

    if (dob > asOf) {
      setError('Date of Birth cannot be after Calculate as of Date');
      return;
    }

    // Calculate exact age
    let years = asOf.getFullYear() - dob.getFullYear();
    let months = asOf.getMonth() - dob.getMonth();
    let days = asOf.getDate() - dob.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-7 h-7" />
          Check Your Age
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Age Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asof">Calculate as of Date</Label>
              <Input
                id="asof"
                type="date"
                value={calculateAsOf}
                onChange={(e) => setCalculateAsOf(e.target.value)}
                className="w-full"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-3 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button onClick={calculateAge} className="w-full" size="lg">
              Calculate Age
            </Button>

            {result && (
              <div className="bg-primary/10 border border-primary/20 rounded-sm p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Your exact age is:</p>
                <p className="text-3xl font-bold text-primary">
                  {result.years} Years, {result.months} Months, {result.days} Days
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
