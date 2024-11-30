"use client";

import { Card } from "@/components/ui/card";
import { BackgroundCheckResult } from "@/lib/types/report";
import { AlertCircle, FileText, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
              <div className="space-y-4">
                {courtRecords.map((record, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <dl className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-sm text-gray-600">Court</dt>
                        <dd className="font-medium">{record.court}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Type</dt>
                        <dd className="font-medium">{record.type}</dd>
                      </div>
                      {record.caseNumber && (
                        <div>
                          <dt className="text-sm text-gray-600">Case Number</dt>
                          <dd className="font-medium">{record.caseNumber}</dd>
                        </div>
                      )}
                      {record.status && (
                        <div>
                          <dt className="text-sm text-gray-600">Status</dt>
                          <dd className="font-medium">{record.status}</dd>
                        </div>
                      )}
                    </dl>
                    {record.description && (
                      <p className="mt-2 text-sm text-gray-600">{record.description}</p>
                    )}
                  </div>
                ))}
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
              <div className="space-y-4">
                {defaulterRecords.map((record, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <dl className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-sm text-gray-600">Source</dt>
                        <dd className="font-medium">{record.source}</dd>
                      </div>
                      {record.amount && (
                        <div>
                          <dt className="text-sm text-gray-600">Amount</dt>
                          <dd className="font-medium">₹{record.amount.toLocaleString()}</dd>
                        </div>
                      )}
                      {record.date && (
                        <div>
                          <dt className="text-sm text-gray-600">Date</dt>
                          <dd className="font-medium">{record.date}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm text-gray-600">Status</dt>
                        <dd className="font-medium">{record.status}</dd>
                      </div>
                    </dl>
                    {record.description && (
                      <p className="mt-2 text-sm text-gray-600">{record.description}</p>
                    )}
                  </div>
                ))}
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
              <div className="space-y-4">
                {firRecords.map((record, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <dl className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-sm text-gray-600">Station</dt>
                        <dd className="font-medium">{record.stationName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">FIR Number</dt>
                        <dd className="font-medium">{record.firNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Date</dt>
                        <dd className="font-medium">{record.date}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Status</dt>
                        <dd className="font-medium">{record.status}</dd>
                      </div>
                    </dl>
                    {record.description && (
                      <p className="mt-2 text-sm text-gray-600">{record.description}</p>
                    )}
                  </div>
                ))}
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