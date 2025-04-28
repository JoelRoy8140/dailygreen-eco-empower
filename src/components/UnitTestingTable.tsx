
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableCellsSplit } from "lucide-react";

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage?: string;
  lastRun: string;
}

const mockTestResults: TestResult[] = [
  {
    id: '1',
    name: 'Should calculate total correctly',
    status: 'passed',
    duration: 45,
    lastRun: '2025-04-28T10:30:00'
  },
  {
    id: '2',
    name: 'Should handle empty input',
    status: 'failed',
    duration: 23,
    errorMessage: 'Expected empty array to return 0',
    lastRun: '2025-04-28T10:30:00'
  },
  {
    id: '3',
    name: 'Should validate user input',
    status: 'passed',
    duration: 12,
    lastRun: '2025-04-28T10:30:00'
  },
  {
    id: '4',
    name: 'Should skip incomplete test',
    status: 'skipped',
    duration: 0,
    lastRun: '2025-04-28T10:30:00'
  }
];

export function UnitTestingTable() {
  const getStatusBadge = (status: TestResult['status']) => {
    const styles = {
      passed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      skipped: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    return `${ms}ms`;
  };

  return (
    <Card className="w-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <TableCellsSplit className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Unit Test Results</h2>
      </div>
      
      <div className="p-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Test Name</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead className="w-[200px]">Last Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTestResults.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    {test.name}
                    {test.errorMessage && (
                      <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {test.errorMessage}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>{formatDuration(test.duration)}</TableCell>
                  <TableCell>{formatDate(test.lastRun)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
