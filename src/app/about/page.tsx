import type { Metadata } from "next";
import Link from "next/link";
import { PrintResume } from "@/components/PrintResume";
import { profile } from "@/data/profile";
import "./about.css";

export const metadata: Metadata = {
  title: "About me",
  description: "Jinsoul의 소개, 프로젝트와 경험을 모은 포트폴리오입니다.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-hero">
        <div>
          <p className="eyebrow">ABOUT ME / PORTFOLIO</p>
          <h1>{profile.headline}</h1>
          <p className="about-intro">{profile.introduction}</p>
          <div className="about-actions">
            <a className="about-button about-button-primary" href="#projects">프로젝트 보기 <span aria-hidden="true">↓</span></a>
            <PrintResume />
          </div>
        </div>
        <div className="about-signature">
          <span className="about-monogram" aria-hidden="true">j.</span>
          <p>{profile.name}</p>
          <span>배움과 경험을 쌓는 기록</span>
        </div>
      </header>

      <div className="about-grid">
        <aside className="about-sidebar">
          <p className="eyebrow">CONTENTS</p>
          <nav aria-label="프로필 목차">
            <a href="#projects">01 <span>프로젝트</span></a>
            <a href="#experience">02 <span>경력</span></a>
            <a href="#education">03 <span>교육</span></a>
            <a href="#contact">04 <span>연결하기</span></a>
          </nav>
        </aside>
        <div className="about-content">
          <section id="projects" className="about-section">
            <div className="about-section-title"><h2>만들어온 것들</h2><span>SELECTED WORK</span></div>
            {profile.projects.map((project) => (
              <article className="about-project" key={project.name}>
                <p className="eyebrow">{project.category}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <ul className="about-highlights">{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                <ul className="about-stack" aria-label="프로젝트 사용 기술">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="about-project-links">
                  <Link href={project.href}>사이트 보기 <span aria-hidden="true">↗</span></Link>
                  <a href={project.source}>GitHub <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </section>
          {([
            { id: "experience", title: "일하며 쌓은 경험", label: "EXPERIENCE", entries: profile.experience },
            { id: "education", title: "배움의 기록", label: "EDUCATION", entries: profile.education },
          ]).map((section) => (
            <section id={section.id} className="about-section" key={section.id}>
              <div className="about-section-title"><h2>{section.title}</h2><span>{section.label}</span></div>
              {section.entries.length ? section.entries.map((entry) => (
                <article className="about-timeline" key={`${entry.period}-${entry.title}`}>
                  <time>{entry.period}</time>
                  <div><h3>{entry.title}</h3><p className="about-organization">{entry.organization}</p><p>{entry.description}</p></div>
                </article>
              )) : <p className="about-pending">경험을 정리하고 있습니다. 곧 소개할게요.</p>}
            </section>
          ))}
          <section id="contact" className="about-section about-contact">
            <p className="eyebrow">LET’S CONNECT</p>
            <h2>더 많은 이야기는 여기에서.</h2>
            <p>코드와 글에서 이어지는 배움의 기록을 만나보세요.</p>
            <div className="about-project-links">
              <a href={profile.github}>GitHub <span aria-hidden="true">↗</span></a>
              <Link href="/">블로그 읽기 <span aria-hidden="true">↗</span></Link>
              {profile.email && <a href={`mailto:${profile.email}`}>이메일 보내기 <span aria-hidden="true">↗</span></a>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
