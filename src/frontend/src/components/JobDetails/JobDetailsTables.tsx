import { Calendar, IndianRupee, Users, FileText, ClipboardCheck } from 'lucide-react';
import { JobPost } from '../../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getLinkStatus } from '../../utils/linkAvailability';

interface JobDetailsTablesProps {
  post: JobPost;
}

export function JobDetailsTables({ post }: JobDetailsTablesProps) {
  const syllabusStatus = getLinkStatus(post.syllabusUrl);

  return (
    <div className="space-y-6">
      {/* Important Dates Section */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Important Dates
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Event</TableHead>
                <TableHead className="font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {post.importantDates.applicationBegin && (
                <TableRow>
                  <TableCell className="font-medium">Application Begin</TableCell>
                  <TableCell>{post.importantDates.applicationBegin}</TableCell>
                </TableRow>
              )}
              {post.importantDates.lastDate && (
                <TableRow>
                  <TableCell className="font-medium">Last Date</TableCell>
                  <TableCell>{post.importantDates.lastDate}</TableCell>
                </TableRow>
              )}
              {post.importantDates.feePaymentLastDate && (
                <TableRow>
                  <TableCell className="font-medium">Last Date for Fee Payment</TableCell>
                  <TableCell>{post.importantDates.feePaymentLastDate}</TableCell>
                </TableRow>
              )}
              {post.importantDates.examDate && (
                <TableRow>
                  <TableCell className="font-medium">Exam Date</TableCell>
                  <TableCell>{post.importantDates.examDate}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Application Fee Section */}
      {post.fees && post.fees.length > 0 && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Application Fee
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Fee Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {post.fees.map((fee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{fee.name}</TableCell>
                    <TableCell>{fee.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Age Limit Section */}
      {post.ageLimit && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Age Limit
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Requirement</TableHead>
                  <TableHead className="font-bold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {post.ageLimit.minAge !== undefined && post.ageLimit.minAge !== null && (
                  <TableRow>
                    <TableCell className="font-medium">Minimum Age</TableCell>
                    <TableCell>{post.ageLimit.minAge.toString()} years</TableCell>
                  </TableRow>
                )}
                {post.ageLimit.maxAge !== undefined && post.ageLimit.maxAge !== null && (
                  <TableRow>
                    <TableCell className="font-medium">Maximum Age</TableCell>
                    <TableCell>{post.ageLimit.maxAge.toString()} years</TableCell>
                  </TableRow>
                )}
                {post.ageLimit.relaxation && (
                  <TableRow>
                    <TableCell className="font-medium">Age Relaxation</TableCell>
                    <TableCell>
                      {post.ageLimit.notes || 'Age Relaxation as per rules'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Vacancy Details Section */}
      {post.vacancies && post.vacancies.length > 0 && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Vacancy Details
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Post Name</TableHead>
                  <TableHead className="font-bold">Total Posts</TableHead>
                  <TableHead className="font-bold">Eligibility (Education Qualification)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {post.vacancies.map((vacancy, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{vacancy.postName}</TableCell>
                    <TableCell>{vacancy.totalPosts.toString()}</TableCell>
                    <TableCell>{vacancy.eligibility}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Selection Process & Syllabus Section */}
      {(post.selectionProcess || post.syllabusUrl) && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Selection Process & Syllabus
          </h2>
          <div className="bg-muted/50 border border-border rounded-sm p-4 space-y-4">
            {post.selectionProcess && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Selection Process:</h3>
                <p className="text-foreground whitespace-pre-wrap">{post.selectionProcess}</p>
              </div>
            )}
            
            {syllabusStatus.isAvailable ? (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Detailed Syllabus:</h3>
                <a
                  href={post.syllabusUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors min-h-[48px]"
                >
                  <FileText className="w-4 h-4" />
                  Download Detailed Syllabus
                </a>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Detailed Syllabus:</h3>
                <div className="inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold px-6 py-3 rounded-sm border border-border cursor-not-allowed min-h-[48px]">
                  <FileText className="w-4 h-4" />
                  {syllabusStatus.label}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
