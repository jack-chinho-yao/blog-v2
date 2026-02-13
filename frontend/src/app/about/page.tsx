export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">About Me</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose prose-lg max-w-none">
          <p>
            Hi, I&apos;m <strong>Jack Yao</strong>, a software developer based in Calgary, Alberta.
          </p>
          <p>
            This blog is my personal space to share knowledge and experiences in software development.
            I write about Java, Spring Boot, React, cloud computing, and other technologies.
          </p>

          <h2>Tech Stack</h2>
          <ul>
            <li><strong>Backend:</strong> Java 17, Spring Boot 3, Spring Security, JPA/Hibernate</li>
            <li><strong>Frontend:</strong> React, Next.js, TypeScript, Tailwind CSS</li>
            <li><strong>Database:</strong> PostgreSQL, Redis</li>
            <li><strong>DevOps:</strong> Docker, AWS</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Feel free to reach out via email or connect on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
