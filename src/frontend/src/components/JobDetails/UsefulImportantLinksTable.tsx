import { Download, FileText, Globe, CreditCard } from 'lucide-react';
import { JobPost } from '../../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getLinkStatus } from '../../utils/linkAvailability';

interface UsefulImportantLinksTableProps {
  post: JobPost;
}

export function UsefulImportantLinksTable({ post }: UsefulImportantLinksTableProps) {
  const admitCardStatus = getLinkStatus(post.admitCardUrl);
  const syllabusStatus = getLinkStatus(post.syllabusUrl);
  const notificationStatus = getLinkStatus(post.links.notification);
  const websiteStatus = getLinkStatus(post.links.officialWebsite);

  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">
        Useful Important Links
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Link Type</TableHead>
              <TableHead className="font-bold">Status / Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Download Admit Card */}
            <TableRow>
              <TableCell className="font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Download Admit Card
              </TableCell>
              <TableCell>
                {admitCardStatus.isAvailable ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm bg-primary/10 text-primary">
                      ✓ Available Now
                    </span>
                    <a
                      href={post.admitCardUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-primary/90 transition-colors min-h-[44px]"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                    {admitCardStatus.label}
                  </span>
                )}
              </TableCell>
            </TableRow>

            {/* Download Syllabus PDF */}
            <TableRow>
              <TableCell className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Download Syllabus PDF
              </TableCell>
              <TableCell>
                {syllabusStatus.isAvailable ? (
                  <a
                    href={post.syllabusUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-secondary/80 transition-colors border border-border min-h-[44px]"
                  >
                    <FileText className="w-4 h-4" />
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                    {syllabusStatus.label}
                  </span>
                )}
              </TableCell>
            </TableRow>

            {/* Download Notification */}
            <TableRow>
              <TableCell className="font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Notification
              </TableCell>
              <TableCell>
                {notificationStatus.isAvailable ? (
                  <a
                    href={post.links.notification!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-secondary/80 transition-colors border border-border min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                    {notificationStatus.label}
                  </span>
                )}
              </TableCell>
            </TableRow>

            {/* Official Website */}
            <TableRow>
              <TableCell className="font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Official Website
              </TableCell>
              <TableCell>
                {websiteStatus.isAvailable ? (
                  <a
                    href={post.links.officialWebsite!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-sm hover:bg-secondary/80 transition-colors border border-border min-h-[44px]"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                    {websiteStatus.label}
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
