import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { Category, type JobPost, type ImportantDates, type FeeCategory, type AgeLimit, type VacancyDetail, type Block } from '../../backend';
import JobPostBlocksEditor from './JobPostBlocksEditor';

interface JobPostFormProps {
  initialData?: JobPost;
  onSubmit: (data: JobPostFormData) => void;
  isSubmitting: boolean;
}

export interface JobPostFormData {
  name: string;
  posterImage: string | null;
  dates: ImportantDates;
  fees: FeeCategory[];
  ageLimit: AgeLimit | null;
  vacancies: VacancyDetail[];
  selectionProcess: string | null;
  syllabusUrl: string | null;
  admitCardUrl: string | null;
  category: Category;
  links: {
    applyOnline?: string;
    notification?: string;
    officialWebsite?: string;
  };
  blocks: Block[];
}

export default function JobPostForm({ initialData, onSubmit, isSubmitting }: JobPostFormProps) {
  const [formData, setFormData] = useState<JobPostFormData>({
    name: initialData?.name || '',
    posterImage: initialData?.posterImage || null,
    dates: initialData?.importantDates || {
      applicationBegin: undefined,
      lastDate: undefined,
      feePaymentLastDate: undefined,
      examDate: undefined,
    },
    fees: initialData?.fees || [],
    ageLimit: initialData?.ageLimit || null,
    vacancies: initialData?.vacancies || [],
    selectionProcess: initialData?.selectionProcess || null,
    syllabusUrl: initialData?.syllabusUrl || null,
    admitCardUrl: initialData?.admitCardUrl || null,
    category: initialData?.category || Category.latestJobs,
    links: initialData?.links || {
      applyOnline: undefined,
      notification: undefined,
      officialWebsite: undefined,
    },
    blocks: initialData?.blocks || [],
  });

  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, posterImage: base64String });
      setImagePreviewError(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const clearPosterImage = () => {
    setFormData({ ...formData, posterImage: null });
    setImagePreviewError(false);
  };

  const addFeeCategory = () => {
    setFormData({
      ...formData,
      fees: [...formData.fees, { name: '', amount: '' }],
    });
  };

  const removeFeeCategory = (index: number) => {
    setFormData({
      ...formData,
      fees: formData.fees.filter((_, i) => i !== index),
    });
  };

  const updateFeeCategory = (index: number, field: 'name' | 'amount', value: string) => {
    const newFees = [...formData.fees];
    newFees[index] = { ...newFees[index], [field]: value };
    setFormData({ ...formData, fees: newFees });
  };

  const addVacancy = () => {
    setFormData({
      ...formData,
      vacancies: [...formData.vacancies, { postName: '', totalPosts: 0n, eligibility: '' }],
    });
  };

  const removeVacancy = (index: number) => {
    setFormData({
      ...formData,
      vacancies: formData.vacancies.filter((_, i) => i !== index),
    });
  };

  const updateVacancy = (index: number, field: keyof VacancyDetail, value: string | bigint) => {
    const newVacancies = [...formData.vacancies];
    newVacancies[index] = { ...newVacancies[index], [field]: value };
    setFormData({ ...formData, vacancies: newVacancies });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Job Post Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Category.latestJobs}>Latest Jobs</SelectItem>
                <SelectItem value={Category.admitCards}>Admit Cards</SelectItem>
                <SelectItem value={Category.results}>Results</SelectItem>
                <SelectItem value={Category.closedPosts}>Closed Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Poster / Banner Image */}
      <Card>
        <CardHeader>
          <CardTitle>Job Poster / Banner Image</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add a banner image that will be displayed at the top of the job details page. You can paste an image URL or upload a file.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="posterImageUrl">Image URL</Label>
            <Input
              id="posterImageUrl"
              value={formData.posterImage || ''}
              onChange={(e) => {
                setFormData({ ...formData, posterImage: e.target.value || null });
                setImagePreviewError(false);
              }}
              placeholder="https://example.com/image.jpg or paste data URL"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border"></div>
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div>
            <Label htmlFor="posterImageFile">Upload Image File</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="posterImageFile"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {formData.posterImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearPosterImage}
                  title="Clear image"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Image Preview */}
          {formData.posterImage && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 border rounded-lg overflow-hidden bg-muted">
                {imagePreviewError ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">Image preview not available</p>
                    <p className="text-xs mt-1">The image URL may be invalid or the file could not be loaded</p>
                  </div>
                ) : (
                  <img
                    src={formData.posterImage}
                    alt="Poster preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImagePreviewError(true)}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="applicationBegin">Application Begin Date</Label>
            <Input
              id="applicationBegin"
              value={formData.dates.applicationBegin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dates: { ...formData.dates, applicationBegin: e.target.value || undefined },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="lastDate">Last Date</Label>
            <Input
              id="lastDate"
              value={formData.dates.lastDate || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dates: { ...formData.dates, lastDate: e.target.value || undefined },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="feePaymentLastDate">Fee Payment Last Date</Label>
            <Input
              id="feePaymentLastDate"
              value={formData.dates.feePaymentLastDate || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dates: { ...formData.dates, feePaymentLastDate: e.target.value || undefined },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="examDate">Exam Date</Label>
            <Input
              id="examDate"
              value={formData.dates.examDate || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dates: { ...formData.dates, examDate: e.target.value || undefined },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Application Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Application Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.fees.map((fee, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`fee-name-${index}`}>Category Name</Label>
                <Input
                  id={`fee-name-${index}`}
                  value={fee.name}
                  onChange={(e) => updateFeeCategory(index, 'name', e.target.value)}
                  placeholder="e.g., General/OBC"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`fee-amount-${index}`}>Amount</Label>
                <Input
                  id={`fee-amount-${index}`}
                  value={fee.amount}
                  onChange={(e) => updateFeeCategory(index, 'amount', e.target.value)}
                  placeholder="e.g., ₹500"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeFeeCategory(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFeeCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Category
          </Button>
        </CardContent>
      </Card>

      {/* Age Limit */}
      <Card>
        <CardHeader>
          <CardTitle>Age Limit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAge">Minimum Age</Label>
              <Input
                id="minAge"
                type="number"
                value={formData.ageLimit?.minAge?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ageLimit: {
                      ...(formData.ageLimit || { relaxation: false }),
                      minAge: e.target.value ? BigInt(e.target.value) : undefined,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="maxAge">Maximum Age</Label>
              <Input
                id="maxAge"
                type="number"
                value={formData.ageLimit?.maxAge?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ageLimit: {
                      ...(formData.ageLimit || { relaxation: false }),
                      maxAge: e.target.value ? BigInt(e.target.value) : undefined,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="relaxation"
              checked={formData.ageLimit?.relaxation || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ageLimit: {
                    ...(formData.ageLimit || {}),
                    relaxation: e.target.checked,
                  },
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="relaxation">Age Relaxation Available</Label>
          </div>

          <div>
            <Label htmlFor="ageLimitNotes">Notes</Label>
            <Textarea
              id="ageLimitNotes"
              value={formData.ageLimit?.notes || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ageLimit: {
                    ...(formData.ageLimit || { relaxation: false }),
                    notes: e.target.value || undefined,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Vacancy Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vacancy Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.vacancies.map((vacancy, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <Label>Vacancy {index + 1}</Label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVacancy(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label htmlFor={`vacancy-postName-${index}`}>Post Name</Label>
                <Input
                  id={`vacancy-postName-${index}`}
                  value={vacancy.postName}
                  onChange={(e) => updateVacancy(index, 'postName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`vacancy-totalPosts-${index}`}>Total Posts</Label>
                <Input
                  id={`vacancy-totalPosts-${index}`}
                  type="number"
                  value={vacancy.totalPosts.toString()}
                  onChange={(e) => updateVacancy(index, 'totalPosts', BigInt(e.target.value || 0))}
                />
              </div>
              <div>
                <Label htmlFor={`vacancy-eligibility-${index}`}>Eligibility</Label>
                <Input
                  id={`vacancy-eligibility-${index}`}
                  value={vacancy.eligibility}
                  onChange={(e) => updateVacancy(index, 'eligibility', e.target.value)}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addVacancy}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vacancy
          </Button>
        </CardContent>
      </Card>

      {/* Selection Process */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Process</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.selectionProcess || ''}
            onChange={(e) =>
              setFormData({ ...formData, selectionProcess: e.target.value || null })
            }
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Important Links */}
      <Card>
        <CardHeader>
          <CardTitle>Important Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="syllabusUrl">Syllabus PDF URL</Label>
            <Input
              id="syllabusUrl"
              value={formData.syllabusUrl || ''}
              onChange={(e) => setFormData({ ...formData, syllabusUrl: e.target.value || null })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="admitCardUrl">Admit Card URL</Label>
            <Input
              id="admitCardUrl"
              value={formData.admitCardUrl || ''}
              onChange={(e) => setFormData({ ...formData, admitCardUrl: e.target.value || null })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="applyOnline">Apply Online URL</Label>
            <Input
              id="applyOnline"
              value={formData.links.applyOnline || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  links: { ...formData.links, applyOnline: e.target.value || undefined },
                })
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="notification">Notification URL</Label>
            <Input
              id="notification"
              value={formData.links.notification || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  links: { ...formData.links, notification: e.target.value || undefined },
                })
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="officialWebsite">Official Website URL</Label>
            <Input
              id="officialWebsite"
              value={formData.links.officialWebsite || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  links: { ...formData.links, officialWebsite: e.target.value || undefined },
                })
              }
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Content Blocks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Build your post content with custom blocks. Add titles, paragraphs, links, images, and tables in any order.
          </p>
        </CardHeader>
        <CardContent>
          <JobPostBlocksEditor
            blocks={formData.blocks}
            onChange={(blocks) => setFormData({ ...formData, blocks })}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Job Post' : 'Create Job Post'}
        </Button>
      </div>
    </form>
  );
}
