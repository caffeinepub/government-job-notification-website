import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, ClipboardCheck } from 'lucide-react';

export function PreparationResourcesSection() {
  return (
    <section className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Preparation & Resources
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box 1: Mool Kitab (Authentic Books) */}
        <Card className="bg-white dark:bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Mool Kitab (Authentic Books)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <a
                href="https://education.rajasthan.gov.in/content/raj/education/en/home.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">RBSE Books</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Rajasthan Board textbooks and study materials
                </div>
              </a>
              
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">NCERT Books</div>
                <div className="text-xs text-muted-foreground mt-1">
                  National Council textbooks for all classes
                </div>
              </a>
              
              <a
                href="https://www.hindigranthaacademy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">Hindi Granth Academy</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Hindi literature and reference books
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Box 2: Online Courses */}
        <Card className="bg-white dark:bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Online Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
              >
                <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">Featured</span>
                  Niraj Class App
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Comprehensive video courses for competitive exams
                </div>
              </a>
              
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">YouTube Channels</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Free educational content and tutorials
                </div>
              </a>
              
              <a
                href="https://www.unacademy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">Unacademy</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Live classes and recorded courses
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Box 3: Test Series */}
        <Card className="bg-white dark:bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              Test Series
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <a
                href="https://testbook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">Testbook</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Mock tests for all government exams
                </div>
              </a>
              
              <a
                href="https://www.adda247.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">Adda247</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Practice tests and quizzes
                </div>
              </a>
              
              <a
                href="https://gradeup.co"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded hover:bg-accent transition-colors border border-border"
              >
                <div className="font-semibold text-sm text-foreground">GradeUp</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Free and paid mock test series
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
