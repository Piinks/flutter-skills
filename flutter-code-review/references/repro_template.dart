
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('PR <NUMBER> Review/Reproduction Tests', () {
    testWidgets('ISSUE: <Description of the issue found>', (WidgetTester tester) async {
      // 1. Build the widget tree that illustrates the issue.
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: Text('Example'),
            ),
          ),
        ),
      );

      // 2. Perform actions (scrolling, tapping, etc.).
      // await tester.drag(find.byType(ListView), const Offset(0.0, -300.0));
      // await tester.pumpAndSettle();

      // 3. Verify the state/behavior.
      // expect(find.text('Example'), findsOneWidget);
    });

    testWidgets('VERIFY: <Description of behavior to verify>', (WidgetTester tester) async {
      // Similar structure to above for verifying expected behavior.
    });
  });
}
