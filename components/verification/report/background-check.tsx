import { Card } from "@/components/ui/card";
import { BackgroundCheckResult } from "@/lib/types/report";
import { AlertCircle, FileText, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  result: BackgroundCheckResult;
}

export function BackgroundCheckSection({ result }: Props) {
  const { courtRecords, defaulterRecords, firRecords } = result;

  const hasRecords = 
    courtRecords.length > 0 || 
    defaulterRecords.length > 0 || 
    firRecords.length > 0;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Background Check Result</h2>
        </div>
        {hasRecords && (
          <div className="flex items-center text-yellow-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Records Found</span>
          </div>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="court">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Court Records</span>
              {courtRecords.length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {courtRecords.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {courtRecords.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Court</TableHead>
                      <TableHead>Case Since</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courtRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.court}</TableCell>
                        <TableCell>{record.year}</TableCell>
                        <TableCell>{record.status || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No court records found</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="defaulter">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Defaulter Records</span>
              {defaulterRecords.length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {defaulterRecords.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {defaulterRecords.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaulterRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.source}</TableCell>
                        <TableCell>
                          {record.amount ? `₹${record.amount.toLocaleString()}` : 'N/A'}
                        </TableCell>
                        <TableCell>{record.date || 'N/A'}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {record.description || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No defaulter records found</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fir">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>FIR Records</span>
              {firRecords.length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {firRecords.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {firRecords.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>FIR Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.stationName}</TableCell>
                        <TableCell>{record.firNumber}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {record.description || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No FIR records found</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}