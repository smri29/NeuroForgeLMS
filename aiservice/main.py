# aiservice/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import io
import traceback

# Initialize App
app = FastAPI()

# Enable CORS (So React can talk to this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class TestCase(BaseModel):
    input: str
    output: str

class CodeSubmission(BaseModel):
    code: str
    test_cases: list[TestCase]

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "NeuroForge AI Service is Online 🧠"}

@app.post("/execute")
def execute_code(submission: CodeSubmission):
    results = []
    all_passed = True
    
    # 1. Define the safe context for execution
    # We allow standard built-ins but restrict dangerous globals
    allowed_globals = {"__builtins__": __builtins__}
    
    for i, case in enumerate(submission.test_cases):
        # Capture stdout to see if user printed anything for debugging
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output
        
        try:
            # 2. Prepare the execution script
            # We assume the code defines a function. We grab the function name 
            # and call it with the test input.
            
            # Detect function name (assuming simple "def name(...):")
            func_name = submission.code.split('def ')[1].split('(')[0]
            
            # Helper script to run the specific test case
            run_script = f"""
{submission.code}

# Test Case Execution
input_val = {case.input}
result = {func_name}(input_val)
"""
            # 3. Execute!
            local_scope = {}
            exec(run_script, allowed_globals, local_scope)
            
            # 4. Get Result
            user_result = local_scope.get('result')
            
            # Convert results to string for comparison (handling lists, etc.)
            # We normalize spaces (remove them) to avoid formatting errors
            user_result_str = str(user_result).replace(" ", "")
            expected_str = case.output.replace(" ", "")
            
            passed = user_result_str == expected_str
            if not passed:
                all_passed = False
                
            results.append({
                "case": i + 1,
                "passed": passed,
                "input": case.input,
                "expected": case.output,
                "actual": str(user_result),
                "log": redirected_output.getvalue()
            })
            
        except Exception as e:
            all_passed = False
            results.append({
                "case": i + 1,
                "passed": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            })
            
        finally:
            # Restore stdout so the server logs still work
            sys.stdout = old_stdout

    # Format the final output for the frontend console
    console_output = "Execution Results:\n"
    console_output += "=" * 20 + "\n"
    for res in results:
        status = "✅ PASS" if res['passed'] else "❌ FAIL"
        console_output += f"Test Case {res['case']}: {status}\n"
        if not res['passed']:
            if 'error' in res:
                console_output += f"   Error: {res['error']}\n"
            else:
                console_output += f"   Expected: {res['expected']}\n"
                console_output += f"   Got:      {res['actual']}\n"
    
    if all_passed:
        console_output += "\n🎉 ALL TEST CASES PASSED!"
    else:
        console_output += "\n⚠️ SOME TESTS FAILED. KEEP TRYING!"

    return {
        "passed": all_passed,
        "results": console_output
    }