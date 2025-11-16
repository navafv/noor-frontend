import React from 'react';
import { Sparkles, Target, Eye } from 'lucide-react';

function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About Noor Stitching Institute
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Empowering creativity, one stitch at a time.
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Our Story */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              Founded with a passion for textile arts, Noor Stitching Institute was established to provide high-quality, accessible education in tailoring, fashion design, and embroidery. We believe in nurturing the creative potential of every student, providing them with the practical skills and confidence to succeed in the fashion industry or as entrepreneurs.
            </p>
          </section>
          
          {/* Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide comprehensive, hands-on training in stitching and design, fostering a community of skilled artisans and designers.
              </p>
            </div>
            <div className="card p-6">
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">Our Vision</h3>
              <p className="text-muted-foreground">
                To be a leading center for textile education, recognized for our quality, innovation, and commitment to student success.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;