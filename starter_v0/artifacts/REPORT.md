# Day 04 Lab v2 Report — Research Paper Scout Agent

## Team Information

- **Nhóm:** Research Paper Scout Team
- **Thành viên & Phân công:**
  1. **Phạm Tuấn Anh** (`2A202601060`): Phụ trách phần **UI & System Integration** (Xây dựng giao diện React Web UI `ui-react` & Flask API Backend `server.py`).
  2. **Phạm Danh Tuấn Dũng** (`2A202601978`): Phụ trách phần **Tool Development** (Phát triển các Custom Tool: `rank_papers`, `extract_method_results`, `summarize_paper`, và tối ưu lấy số trích dẫn `citations_count` song song).
  3. **Ngô Minh Phước** (`2A202601576`): Phụ trách phần **System Prompt** (Thiết kế `system_prompt.md`, quy định phạm vi scope boundary, routing rules & argument conventions).
  4. **Nguyễn Xuân Quân** (`2A202601976`): Phụ trách phần **Evaluation & Benchmarking** (Xây dựng bộ testcase `eval_group.json`, thực thi `run_eval.py` & phân tích log lỗi v0–v3).
- **Provider/model:** Google Gemini (`gemini-3.5-flash` / `gemini-1.5-flash`)

---

# PHẦN A — Giới thiệu agent

## A1. Agent này làm được gì

**Research Paper Scout Agent** là trợ lý AI chuyên biệt giúp các nhà nghiên cứu và sinh viên tự động hóa quy trình tìm kiếm bài báo khoa học trên arXiv, lọc bài báo uy tín theo số trích dẫn (`citations_count`), tải và trích xuất nội dung PDF bài báo sang định dạng Markdown/Text có cấu trúc (bóc tách riêng phần **Phương pháp / Methodology** và **Kết quả / Results**), đồng thời tổng hợp thành các bản báo cáo nghiên cứu chuyên sâu.

**Link dùng thử (truy cập trong Showdown):**
- **Web UI URL:** `http://localhost:5173/`
- **Backend API URL:** `http://127.0.0.1:5000`

---

## A2. Tool agent có

| Tên tool | Làm được gì | Tool mới nhóm thêm? |
|---|---|---|
| **`papers`** | Tìm kiếm bài báo khoa học trên arXiv, tích hợp lấy số trích dẫn (`citations_count`) từ Semantic Scholar / OpenAlex | Có (Cải tiến với `citations_count` song song) |
| **`rank_papers`** | Lọc và xếp hạng danh sách bài báo dựa trên độ liên quan từ khóa và điểm uy tín trích dẫn | **Có (Tool mới)** |
| **`paper_text`** | Tải file PDF từ arXiv và trích xuất toàn bộ văn bản sang file `.txt` bản địa | Sẵn có |
| **`extract_method_results`** | Phân tích bài báo để bóc tách riêng các mục **Abstract**, **Methodology**, **Results/Experiments** và **Conclusion** | **Có (Tool mới)** |
| **`summarize_paper`** | Tổng hợp nội dung các phần bóc tách được thành bản báo cáo nghiên cứu Markdown chuẩn chỉnh | **Có (Tool mới)** |
| **`find_paper_code`** | Tìm kiếm mã nguồn (GitHub Repositories) liên quan đến bài báo khoa học | Sẵn có |
| **`clarify`** | Hỏi lại người dùng khi yêu cầu bị thiếu chủ đề hoặc cần xác nhận thao tác nguy hiểm | Sẵn có |
| **`lookup`** | Tra cứu thông tin khái niệm, định nghĩa và tin tức khoa học trên Internet | Sẵn có |
| **`fetch`** | Tải và đọc nội dung chi tiết từ một đường dẫn URL web cụ thể | Sẵn có |
| **`format`** | Trình bày và định dạng dữ liệu đã có thành bản tin (Bullets, Sections, Brief) | Sẵn có |

---

## A3. Câu hỏi mẫu để thử

1. *"Tìm bài báo arXiv về Retrieval Augmented Generation và lọc ra cho mình bài uy tín nhất dựa trên số trích dẫn."*
2. *"Tải và đọc bài báo arXiv mã 1706.03762, bóc tách riêng phần Phương pháp (Methodology) và Kết quả (Results) giúp mình."*
3. *"Tìm giúp mình mã nguồn GitHub triển khai của bài báo Attention Is All You Need."*
4. *"Tìm cho mình vài bài báo khoa học."* *(Agent sẽ dùng `clarify` để hỏi lại chủ đề)*
5. *"Sáng nay ăn phở ở đâu ngon tại Hà Nội?"* *(Agent nhận diện out-of-scope và từ chối lịch sự không gọi tool)*

---

## A4. Kịch bản demo đã rehearse

| Scenario | Tool trace cần thấy | Câu chuyện cải thiện version | Fallback run/transcript |
|---|---|---|---|
| **1. Tìm báo & lọc độ uy tín** | `papers` ➔ `rank_papers` | **v0** gọi sai tool hoặc không có số trích dẫn; **v3** tự động gọi `papers` kèm `citations_count` và dùng `rank_papers` lọc bài uy tín nhất. | `v3_B_group_gemini_20260729T163547173365.json` |
| **2. Bóc tách PDF Method & Results** | `paper_text` ➔ `extract_method_results` ➔ `summarize_paper` | **v0** chỉ lấy text thô 5 trang đầu; **v3** tự động tải PDF, dùng Regex bóc tách đúng phần **Methodology** & **Results** và đóng gói thành báo cáo Markdown. | `v3_B_group_gemini_20260729T163547173365.json` |
| **3. Xử lý câu hỏi thiếu chủ đề** | `clarify` | **v0** đoán bừa từ khóa tìm kiếm; **v3** nhận diện thiếu topic và chủ động gọi `clarify` hỏi lại người dùng. | `v3_B_base_gemini_20260729T102631589712.json` |
| **4. Từ chối câu ngoài phạm vi** | *(Không gọi tool nào)* | **v0** cố tình gọi `lookup` tìm quán phở; **v3** tuân thủ ranh giới Scope Boundary, trả lời thẳng bằng văn bản không gọi tool. | `v3_B_base_gemini_20260729T102631589712.json` |
| **5. Định dạng báo cáo cuối cùng** | `format` (template: `sections`) | **v0** gọi `clarify` nhầm lẫn; **v3** nhận diện intent trình bày và ưu tiên gọi `format` với `template: "sections"`. | `v3_B_group_gemini_20260729T163547173365.json` |

---

# PHẦN B — Chi tiết / Bằng chứng

## B1. Version evidence

Dữ liệu thực tế trích xuất từ `artifacts/version_log.csv` và các file run JSON trong `runs/`:

| Version | Prompt/tool change | Hypothesis | Metric name | Before | After | Run File |
|---|---|---|---|---:|---:|---|
| **v0** | Baseline gốc của starter kit | Đánh giá khả năng mặc định của LLM trên bộ test | case_accuracy | N/A | 41.7% (5/12) | `v1_B_group_gemini_20260729T160726811430.json` |
| **v1** | Thêm 3 Custom Tool (`rank_papers`, `extract_method_results`, `summarize_paper`) và tích hợp `citations_count` song song | Bổ sung các tool chuyên biệt giúp Agent thực hiện chuỗi bóc tách sâu bài báo | case_accuracy | 41.7% | 50.0% | `v1_B_group_gemini_20260729T160726811430.json` |
| **v2** | Cập nhật `system_prompt.md` thêm Scope Boundary, Clarify Rules & Argument Conventions | Ranh giới Scope rõ ràng và quy tắc tham số sẽ sửa các lỗi `out_of_scope`, `missing_info` và `wrong_arg_value` | case_accuracy | 50.0% | 80.0% | `v2_B_group_gemini_20260729T161715194117.json` |
| **v3** | Thêm ưu tiên Format Tool (`format` > `clarify`), ép kiểu handle social media (`sama`, `elonmusk`), quy tắc xác nhận Telegram | Ưu tiên định dạng và quy định chi tiết tham số thời gian/thể loại sẽ đạt độ chính xác tối đa trên cả Base & Group suite | case_accuracy | 80.0% | **100.0% (12/12)** | `v3_B_base_gemini_20260729T102631589712.json` |

---

## B2. Failure analysis

Phân tích các lỗi thực tế quan sát được trong quá trình tối ưu v0–v2 và giải pháp khắc phục ở v3:

| Case ID | Failure Type | Actual Tool Calls | What Failed | Fix |
|---|---|---|---|---|
| `R01_user_tweets_routing` | `wrong_arg_value` | `timeline(screenname="SamAltman")` | LLM truyền tên đầy đủ thay vì handle Twitter chuẩn (`sama`) | Đưa bảng ánh xạ tên người nổi tiếng ➔ handle vào `system_prompt.md` (`Sam Altman` ➔ `sama`). |
| `R03_web_news_routing` | `wrong_arg_value` | `lookup(query="AI news today")` | LLM giữ nguyên các từ thời gian ("news today") trong `query` | Thêm quy tắc bóc tách tham số: `query` chỉ chứa từ khóa cốt lõi ("AI"), tách "tin tức" thành `topic: "news"` và "hôm nay" thành `timeframe: "day"`. |
| `R05_limit_arg` | `wrong_arg_value` | `timeline(limit=5)` | LLM không trích xuất số lượng "10 tweet" vào tham số `limit` | Thêm hướng dẫn trích xuất tham số số nguyên `limit` trong `system_prompt.md`. |
| `R06_timeframe_arg` | `wrong_arg_value` | `lookup(topic="general")` | LLM không nhận diện được "Tin công nghệ" thuộc thể loại `news` | Đưa quy định: Hễ query chứa từ "tin", "tin tức", "báo" thì bắt buộc set `topic: "news"`. |
| `R08_confirm_publish_telegram` | `wrong_tool` | `send(confirmed=False)` | LLM gọi thẳng tool `send` mà không hỏi xác nhận trước | Đưa quy định bảo mật: Mọi hành động xuất bản/gửi tin phải gọi `clarify` trước để xin phản hồi `yes_no` từ người dùng. |
| `R11_multiturn_clarify_followup` | `wrong_tool` | `papers(...)` + `rank_papers(...)` | LLM gọi thừa tool `rank_papers` trong câu tìm bài báo cơ bản | Cập nhật quy tắc: Tìm kiếm bài báo đơn thuần chỉ gọi duy nhất `papers`, ngoại trừ khi người dùng yêu cầu xếp hạng bài uy tín. |
| `R12_multiturn_context_carry` | `wrong_arg_value` | `lookup(timeframe="week")` | LLM gắn `timeframe: "week"` cho cụm từ "tin tức mới nhất" | Quy định chuẩn hóa: "mới nhất" hoặc "hôm nay" ➔ `timeframe: "day"`. |

---

## B3. Team eval cases

10 testcase tự thiết kế trong file `data/eval_group.json` của nhóm do **Nguyễn Xuân Quân** chủ trì:

| Case ID | What It Tests | Expected Tool/Behavior | Result |
|---|---|---|---|
| `CASE01_Single_Find_Code` | Single-turn: Kiểm tra LLM có biết gọi tool `find_paper_code` không | `find_paper_code(query="Attention is all you need")` | **PASS** |
| `CASE02_Single_Out_of_Scope` | Single-turn: Đánh lừa hỏi câu ngoài lề (ăn phở), LLM không được gọi tool nào | `no_tool: true` (Trả lời thẳng bằng văn bản) | **PASS** |
| `CASE03_Single_Find_Papers` | Single-turn: Tìm kiếm bài báo về Masked Language Modeling | `papers(query="Masked Language Modeling")` | **PASS** |
| `CASE04_Single_Read_Paper` | Single-turn: Kiểm tra tool `paper_text` đọc nội dung file PDF | `paper_text(arxiv_url="1706.03762")` | **PASS** |
| `CASE05_Single_Format` | Single-turn: Ép LLM dùng tool `format` định dạng dữ liệu | `format(template="bullets")` | **PASS** |
| `CASE06_Multi_Missing_Info` | Multi-turn: Yêu cầu mờ nhạt ("Tìm cho tôi vài bài báo"), bắt LLM gọi `clarify` | `clarify(question=...)` | **PASS** |
| `CASE07_Multi_Change_Mind` | Multi-turn: Người dùng "quay xe" đổi ý từ YOLOv10 sang tìm code YOLOv11 | `find_paper_code(query="YOLOv11")` | **PASS** |
| `CASE08_Multi_Context_Memory` | Multi-turn: Khả năng nhớ mã arXiv từ lượt trước để gọi đọc PDF | `paper_text(arxiv_url="2404.19756")` | **PASS** |
| `CASE09_Multi_Tool_Switch` | Multi-turn: Chuyển đổi linh hoạt từ đọc báo sang tra cứu khái niệm RLHF trên Web | `lookup(query="RLHF Reinforcement Learning from Human Feedback")` | **PASS** |
| `CASE10_Multi_Final_Format` | Multi-turn: Yêu cầu tổng hợp toàn bộ lịch sử thành báo cáo dạng `sections` | `format(template="sections")` | **PASS** |

---

## B4. Live chat evidence

Bằng chứng thực nghiệm từ các phiên chạy chat thực tế:

| Scenario/Turn | Version | Tool Calls + Args | Transcript/Run | Outcome |
|---|---|---|---|---|
| **Tìm báo RAG & Lọc uy tín** | `v3` | `papers(query="Retrieval Augmented Generation")` ➔ `rank_papers(query="RAG", top_k=3)` | `v3_B_group_gemini_20260729T163547173365.json` | Đã trả về Top 3 bài báo có lượt trích dẫn cao nhất kèm điểm xếp hạng. |
| **Bóc tách PDF Phương pháp & Kết quả** | `v3` | `paper_text(arxiv_url="2312.10997")` ➔ `extract_method_results(txt_path="...")` ➔ `summarize_paper(...)` | Run Live API (Server test) | Trích xuất riêng được 2 mục **Methodology** và **Results** hiển thị dạng thẻ Markdown. |
| **Hỏi đường dẫn mã nguồn GitHub** | `v3` | `find_paper_code(query="Attention is all you need")` | `v3_B_group_gemini_20260729T163547173365.json` | Trả về đúng link repository `tensorflow/tensor2tensor` kèm số lượt stars. |

---

## B5. Tool capability evidence

| Category | Evidence File | What Worked | Risk / Guardrail |
|---|---|---|---|
| **Must-have: Tool mới 1** | `tools/extract_method_results/tool.py` | Bóc tách chính xác các phần Abstract, Methodology, Results và Conclusion từ file `.txt` bằng Regex pattern matching. | Khi bài báo không theo cấu trúc chuẩn, hàm có sẵn fallback chia 3 phần văn bản tự động. |
| **Must-have: Tool mới 2** | `tools/rank_papers/tool.py` | Tính điểm đòn bẩy độ liên quan từ khóa + thưởng điểm uy tín cho bài báo có `citations_count` cao. | Đảm bảo danh sách trả về luôn giới hạn bởi `top_k` để tránh tràn context. |
| **Must-have: Tool mới 3** | `tools/summarize_paper/tool.py` | Tổng hợp metadata bài báo + nội dung bóc tách thành bản báo cáo Markdown chuyên nghiệp. | Định dạng sẵn cấu trúc tiêu đề chuẩn để LLM không sinh nội dung tự do. |
| **Optional built-in** | `tools/papers/tool.py` | Tích hợp lấy số trích dẫn (`citations_count`) song song qua `ThreadPoolExecutor` từ Semantic Scholar & OpenAlex API. | Giới hạn timeout 1.5s/request để tránh nghẽn server khi tìm kiếm nhiều bài báo. |

---

## B6. Reflection (Bài học rút ra)

1. **Fix nào thuộc về `system_prompt.md`?**
   - Các quy tắc về Scope Boundary (từ chối câu ngoài lề), quy định ánh xạ tên người nổi tiếng sang handle (`Sam Altman` ➔ `sama`), quy tắc ưu tiên gọi tool (`format` > `clarify`), và ranh giới xác nhận an toàn trước khi thực hiện hành động ghi/gửi tin.

2. **Fix nào thuộc về `tools.yaml`?**
   - Việc mô tả rõ ràng kiểu dữ liệu, các giá trị `enum` chuẩn (ví dụ `topic: [general, news]`, `timeframe: [day, week, month, year]`), và mô tả chi tiết công dụng của từng tham số giúp LLM không truyền sai định dạng.

3. **Lỗi nào cần review thủ công thay vì chấm tự động?**
   - Các trường hợp gọi tool đọc PDF (`paper_text`) và bóc tách nội dung (`extract_method_results`): Chấm tự động chỉ kiểm tra được tên tool và tham số URL/Path có đúng không, nhưng để đảm bảo nội dung trích xuất thực sự chính xác và hữu ích thì cần review thủ công nội dung văn bản bóc tách được.

4. **Kế hoạch cải tiến tiếp theo:**
   - Tích hợp thêm nguồn tìm kiếm bài báo từ **Google Scholar** hoặc **PubMed** để mở rộng đa dạng các ngành nghiên cứu (y sinh, kinh tế).
   - Nâng cấp mô hình bóc tách cấu trúc PDF từ Regex thô sang các thư viện xử lý tài liệu thông minh như `pdfplumber` hoặc `MinerU` để trích xuất cả bảng biểu (tables) và biểu đồ (figures).

---
*Báo cáo được hoàn thiện và cập nhật lần cuối vào ngày 29/07/2026 bởi Research Paper Scout Team.*

